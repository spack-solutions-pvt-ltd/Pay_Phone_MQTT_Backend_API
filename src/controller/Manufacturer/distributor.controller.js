const { Distributor, Wallet, WalletTransaction, sequelize, Operator, Terminal, User } = require("../../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { sendDistributorCredentialsEmail, } = require("../../service/mailService");
const { generatePassword } = require("../../utils/generatePassword");



const createDistributor = async (req, res, next) => {

    try {

        const {
            name,
            email,
            phone,
            companyName,
            gstNumber,
            location,
        } = req.body;

        const existingDistributor = await Distributor.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { phone },
                ],
            },
        });

        if (existingDistributor) {
            return res.status(400).json({
                success: false,
                message: "Distributor already exists",
            });
        }

        const dummyPassword = generatePassword()
        const hashedPassword = await bcrypt.hash(dummyPassword, 10);

        const distributorCount = await Distributor.count();

        const distributor = await Distributor.create({
            distributorId: `DST${1000 + distributorCount + 1}`,
            name,
            email,
            password: hashedPassword,
            phone,
            companyName,
            gstNumber,
            location,
        });

        await Wallet.create({
            distributorId: distributor.id,
            balance: 0,
            accountType: "Distributor"
        });

        await sendDistributorCredentialsEmail({
            email,
            dummyPassword,
            name,
        });

        return res.status(201).json({
            success: true,
            message: "Distributor created successfully",
            data: distributor,
        });

    } catch (error) {
        next(error);
    }

};

const getAllDistributors = async (req, res, next) => {

    try {

        let { page = 1, limit = 10, search = "", status, } = req.query;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        const whereCondition = {};

        if (search) {

            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${search}%`, }, },
                { email: { [Op.like]: `%${search}%`, }, },
                { companyName: { [Op.like]: `%${search}%`, }, },
                { phone: { [Op.like]: `%${search}%`, }, },
            ];

        }

        if (status) {
            whereCondition.status = status;
        }
        if (!req.query.page && !req.query.limit) {
            const distributors = await Distributor.findAll({
                attributes: {
                    exclude: ["password"],
                },
                order: [["id", "DESC"]],
            })
            return res.status(200).json({
                success: true,
                message: "Distributor list",
                data: distributors,
            });
        }

        const { count, rows } = await Distributor.findAndCountAll({
            where: whereCondition,
            attributes: {
                exclude: ["password"],
            },
            limit,
            offset,
            order: [["id", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            message: "Distributor list",
            data: rows,
            pagination: {
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                limit,
            },
        });

    } catch (error) {
        next(error);
    }

};

const getDistributorById = async (req, res, next) => {

    try {

        const distributor = await Distributor.findByPk(req.params.id,
            {
                attributes: { exclude: ["password"], },
                include: [
                    { model: Wallet, as: "wallet", attributes: ["balance", "id"], },
                ],
            }
        );

        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Distributor details",
            data: distributor,
        });

    } catch (error) {
        next(error);
    }

};

const updateDistributor = async (req, res, next) => {
    try {

        const distributor = await Distributor.findByPk(req.params.id);

        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            });
        }

        const updateData = {
            ...req.body,
        };

        await distributor.update(updateData);

        return res.status(200).json({
            success: true,
            message: "Distributor updated successfully",
            data: distributor,
        });

    } catch (error) {
        next(error);
    }

};


const updateStatusDistributor = async (req, res, next) => {
    try {
        const { status } = req.body;


        const distributor = await Distributor.findByPk(req.params.id);

        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            });
        }

        await distributor.update({ status });

        return res.status(200).json({
            success: true,
            message: "Distributor Status updated successfully",
            data: distributor,
        });

    } catch (error) {
        next(error);
    }

};

const rechargeDistributorWallet = async (req, res, next) => {

    const transaction = await sequelize.transaction();

    try {
        const manufacturerId = req.manufacturer.id;

        const { distributorId, amount, type, paymentMode, } = req.body;

        if (!distributorId) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Distributor id is required", });
        }

        if (!amount || Number(amount) <= 0) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Valid amount required", });
        }

        if (!type || !["Credit", "Debit"].includes(type)) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Type must be Credit or Debit", });
        }

        const distributor = await Distributor.findOne({
            where: {
                id: distributorId,
            },
            transaction,
            attributes: ["id", "name"],
        });

        if (!distributor) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: "Distributor not found", });
        }

        // FIND DISTRIBUTOR WALLET
        let wallet = await Wallet.findOne({
            where: {
                distributorId: distributor.id,
                accountType: "Distributor",
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        // CREATE WALLET
        if (!wallet) {
            wallet = await Wallet.create({
                distributorId: distributor.id,
                balance: 0,
                accountType: "Distributor",
            }, { transaction, });
        }

        // BALANCE LOGIC
        const previousBalance = Number(wallet.balance);

        let updatedBalance = previousBalance;

        // CREDIT
        if (type === "Credit") {
            updatedBalance = previousBalance + Number(amount);
        }

        // DEBIT
        if (type === "Debit") {
            if (previousBalance < Number(amount)) {
                await transaction.rollback();
                return res.status(400).json({ success: false, message: "Insufficient distributor wallet balance", });
            }

            updatedBalance = previousBalance - Number(amount);
        }

        // UPDATE BALANCE
        wallet.balance = updatedBalance;

        await wallet.save({ transaction, });

        // WALLET TRANSACTION
        await WalletTransaction.create({
            transactionId: `WTX${Date.now()}`,
            walletId: wallet.id,
            manufacturerId,
            amount,
            type,
            remainingBalance: updatedBalance,
            transactionType: type === "Credit" ? "MANUFACTURER_CREDIT" : "MANUFACTURER_DEBIT",
            paymentMode: paymentMode || "Manufacturer Recharge",
        }, { transaction, });

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: type === "Credit" ? "Distributor wallet credited successfully" : "Distributor wallet debited successfully",
            data: {
                distributorId: distributor.id,
                previousBalance,
                updatedBalance,
            },
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

const getDistributorWalletTransactions = async (req, res, next) => {
    try {

        const distributorId = req.params.distributorId;

        let { page = 1, limit = 10, type, transactionType, search = "", } = req.query;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        const distributor = await Distributor.findOne({
            where: {
                id: distributorId,
            },
            attributes: ["id"],
        });

        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            });
        }

        const wallet = await Wallet.findOne({
            where: {
                distributorId,
                accountType: "Distributor",
            },
        });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found",
            });
        }

        const whereCondition = {
            walletId: wallet.id,
            // distributorId,
        };

        if (type) {
            whereCondition.type = type;
        }

        // transaction type filter
        if (transactionType) {
            whereCondition.transactionType = transactionType;
        }

        if (search) {
            whereCondition[Op.or] = [
                { transactionId: { [Op.like]: `%${search}%`, }, },
                { paymentMode: { [Op.like]: `%${search}%`, }, },
            ];
        }

        const { count, rows } = await WalletTransaction.findAndCountAll({
            where: whereCondition,
            include: [
                { model: Operator, as: "operator", attributes: ["id", "name"], },
            ],
            limit,
            offset,
            order: [["id", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            message: "Wallet transaction list",
            data: rows,
            pagination: {
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                limit,
            },
        });

    } catch (error) {
        next(error);
    }
};

const getDistributorDashboardCards = async (req, res, next) => {
    try {

        const distributorId = req.params.distributorId;

        const totalOperators = await Operator.count({
            where: { distributorId, },
        });

        const terminalCount = await Terminal.count({
            where: { distributorId, },
        });
        const allOperators = await Operator.findAll({
            where: { distributorId, },
            attributes: ["id"],
        });

        const totalUsers = await User.count({
            where: { operatorId: allOperators.map((operator) => operator.id), },
        });

        return res.status(200).json({
            success: true,
            message: "Dashboard cards data",
            data: {
                totalOperators,
                terminalCount,
                totalUsers,
            },
        });

    } catch (error) {
        next(error);
    }
}

const getAllTerminalsByDistributorId = async (req, res, next) => {
    try {
        const distributorId = req.params.distributorId;

        let { page = 1, limit = 10, search = "", status, } = req.query;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        const distributor = await Distributor.findOne({
            where: {
                id: distributorId,
            },
            attributes: ["id"],
        });

        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            });
        }

        const whereCondition = { distributorId };

        // status filter
        if (status) {
            whereCondition.status = status;
        }

        // search
        if (search) {
            whereCondition[Op.or] = [
                { terminalId: { [Op.like]: `%${search}%`, }, },
                { serialNo: { [Op.like]: `%${search}%`, }, },
                { campus: { [Op.like]: `%${search}%`, }, },
            ];
        }

        const { count, rows } = await Terminal.findAndCountAll({
            where: whereCondition,
            include: [
                { model: Operator, as: "operator", attributes: ["id", "name", "operatorId"], },
            ],
            limit,
            offset,
            order: [["id", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            message: "Terminal list",
            data: rows,
            pagination: {
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                limit,
            },
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    createDistributor,
    getAllDistributors,
    getDistributorById,
    updateDistributor,
    updateStatusDistributor,
    rechargeDistributorWallet,
    getDistributorWalletTransactions,
    getDistributorDashboardCards,
    getAllTerminalsByDistributorId
};