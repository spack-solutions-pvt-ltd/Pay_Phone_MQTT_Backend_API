const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { Operator, sequelize, Wallet, WalletTransaction, Terminal, User, } = require("../../models");
const { sendOperatorCredentialsEmail } = require("../../service/mailService");
const { generatePassword } = require("../../utils/generatePassword");

const createOperator = async (req, res, next) => {
    try {

        const distributorId = req.distributor.id;

        const {
            name, email, phone,
            companyName, gstNumber, location,
        } = req.body;

        const existingOperator =
            await Operator.findOne({
                where: {
                    [Op.or]: [{ email }, { phone },],
                },
            });

        if (existingOperator) {
            return res.status(400).json({
                success: false,
                message: "Operator already exists",
            });
        }

        const generatedPassword = generatePassword();

        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        const operatorCount = await Operator.count();

        const operator = await Operator.create({
            operatorId: `OPR${1000 + operatorCount + 1}`,
            distributorId,
            name,
            email,
            phone,
            password: hashedPassword,
            companyName,
            gstNumber,
            location,
        });

        await Wallet.create({
            operatorId: operator.id,
            balance: 0,
            accountType: "Operator",
        })

        await sendOperatorCredentialsEmail({
            email,
            password: generatedPassword,
            name,
        });

        return res.status(201).json({
            success: true,
            message: "Operator created successfully",
            data: operator,
        });

    } catch (error) {
        next(error);
    }

};

const getAllOperators = async (req, res, next) => {
    try {

        const distributorId = req.distributor.id;

        let { page = 1, limit = 10, search = "", status, } = req.query;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        const whereCondition = {
            distributorId,
        };

        // search
        if (search) {

            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${search}%`, }, },
                { email: { [Op.like]: `%${search}%`, }, },
                { phone: { [Op.like]: `%${search}%`, }, },
                { companyName: { [Op.like]: `%${search}%`, }, },
                { gstNumber: { [Op.like]: `%${search}%`, }, },
                { location: { [Op.like]: `%${search}%`, }, },
            ];

        }

        // status filter
        if (status) {
            whereCondition.status = status;
        }

        if (!req.query.page && !req.query.limit) {
            const operators = await Operator.findAll({
                where: whereCondition,
                attributes: {
                    exclude: ["password"],
                },
                order: [["id", "DESC"]],
            });
            return res.status(200).json({
                success: true,
                message: "Operator list",
                data: operators,
            });
        }

        const { count, rows } = await Operator.findAndCountAll({
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
            message: "Operator list",
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

const getOperatorById = async (req, res, next) => {

    try {

        const operator = await Operator.findOne({
            where: {
                id: req.params.id,
                distributorId: req.distributor.id,
            },
            attributes: {
                exclude: ["password"],
            },
        });

        if (!operator) {
            return res.status(404).json({
                success: false,
                message: "Operator not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Operator details",
            data: operator,
        });

    } catch (error) {
        next(error);
    }

};

const updateOperator = async (req, res, next) => {
    try {

        const operator = await Operator.findOne({
            where: {
                id: req.params.id,
                distributorId: req.distributor.id,
            },
        });

        if (!operator) {
            return res.status(404).json({
                success: false,
                message: "Operator not found",
            });
        }

        const updateData = {
            ...req.body,
        };

        await operator.update(
            updateData
        );

        return res.status(200).json({
            success: true,
            message: "Operator updated successfully",
            data: operator,
        });

    } catch (error) {
        next(error);
    }

};
const reachargeOperatorWallet = async (req, res, next) => {

    const transaction = await sequelize.transaction();

    try {

        const distributorId = req.distributor.id;

        const { operatorId, amount, type, paymentMode, } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid amount required",
            });
        }

        if (!type || !["Credit", "Debit"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Type must be Credit or Debit",
            });
        }

        const operator = await Operator.findOne({
            where: {
                id: operatorId,
                distributorId,
            },
            transaction,
        });

        if (!operator) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: "Operator not found",
            });

        }

        let wallet = await Wallet.findOne({
            where: {
                operatorId: operator.id,
                accountType: "Operator",
            },
            transaction,
        });

        // create wallet
        if (!wallet) {

            wallet = await Wallet.create({
                operatorId: operator.id,
                balance: 0,
                accountType: "Operator",
            }, { transaction, });

        }

        const previousBalance = Number(wallet.balance);
        let updatedBalance = previousBalance;

        // credit
        if (type === "Credit") {
            updatedBalance = previousBalance + Number(amount);
        }

        // debit
        if (type === "Debit") {

            if (previousBalance < Number(amount)) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: "Insufficient wallet balance",
                });

            }
            updatedBalance = previousBalance - Number(amount);
        }

        wallet.balance = updatedBalance;

        await wallet.save({
            transaction,
        });

        // wallet transaction
        await WalletTransaction.create({
            transactionId: `WTX${Date.now()}`,
            walletId: wallet.id,
            amount,
            type,
            remainingBalance: updatedBalance,
            transactionType: type === "Credit" ? "ADD_FUNDS" : "DEDUCT_FUNDS",
            distributorId,
            paymentMode: paymentMode || "Distributor Recharge",

        }, { transaction, });

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: type === "Credit" ? "Wallet credited successfully" : "Wallet debited successfully",
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};
const getOperatorWalletTransactions = async (req, res, next) => {
    try {

        const distributorId = req.distributor.id;
        const operatorId = req.params.operatorId;

        let { page = 1, limit = 10, type, transactionType, search = "", } = req.query;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        const operator = await Operator.findOne({
            where: {
                id: operatorId,
                distributorId,
            },
            attributes: ["id"],
        });

        if (!operator) {
            return res.status(404).json({
                success: false,
                message: "Operator not found",
            });
        }

        const wallet = await Wallet.findOne({
            where: {
                operatorId,
                accountType: "Operator",
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
            distributorId,
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

const getOperatorDashboardCards = async (req, res, next) => {
    try {

        const operatorId = req.operator.id;

        // wallet
        const wallet = await Wallet.findOne({
            where: {
                operatorId,
                accountType: "Operator",
            },
            attributes: ["balance",],
        });

        // total terminals
        const totalTerminals = await Terminal.count({
            where: {
                operatorId,
            },
        });

        // total users
        const totalUsers = await User.count({
            where: {
                operatorId,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Operator dashboard cards",
            data: {
                totalBalance: wallet ? wallet.balance : 0,
                totalTerminals,
                totalUsers,
            },
        });

    } catch (error) {
        next(error);
    }
};

const updateStatus = async (req, res, next) => {
    try {

        const operator = await Operator.findOne({
            where: {
                id: req.params.id,
                distributorId: req.distributor.id,
            },
        });

        if (!operator) {
            return res.status(404).json({
                success: false,
                message: "Operator not found",
            });
        }

        await operator.update(req.body);

        return res.status(200).json({
            success: true,
            message: "Operator status updated successfully",
            data: operator,
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    createOperator,
    getAllOperators,
    getOperatorById,
    updateOperator,
    reachargeOperatorWallet,
    getOperatorWalletTransactions,
    getOperatorDashboardCards,
    updateStatus,
};