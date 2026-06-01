const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { Operator, sequelize, Wallet, WalletTransaction, Terminal, User, Distributor } = require("../../models");
const { sendOperatorCredentialsEmail } = require("../../service/mailService");
const { generatePassword } = require("../../utils/generatePassword");

const createOperator = async (req, res, next) => {
    try {

        const distributorId = req.distributor.id;

        const {
            name, email, phone,
            companyName, gstNumber, location, per_min_price
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
            per_min_price
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
                { operatorId: { [Op.like]: `%${search}%`, }, },
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
            include: [
                { model: Wallet, as: "wallet", attributes: ["balance", "id"], },
            ],
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
        let { operatorId, amount, type, paymentMode, } = req.body;

        // VALIDATIONS

        amount = Number(amount);

        if (!operatorId) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Operator id is required", });
        }

        if (!amount || amount <= 0) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Valid amount is required", });
        }

        if (!["Credit", "Debit"].includes(type)) {
            await transaction.rollback();
            return res.status(400).json({ success: false, message: "Type must be Credit or Debit", });
        }

        // DISTRIBUTOR WALLET
        const distributorWallet = await Wallet.findOne({
            where: {
                distributorId,
                accountType: "Distributor",
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        if (!distributorWallet) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: "Distributor wallet not found", });
        }

        // OPERATOR CHECK
        const operator = await Operator.findOne({
            where: {
                id: operatorId,
                distributorId,
            },
            attributes: ["id", "name"],
            transaction,
        });

        if (!operator) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: "Operator not found", });
        }

        // OPERATOR WALLET
        let operatorWallet = await Wallet.findOne({
            where: {
                operatorId: operator.id,
                accountType: "Operator",
            },
            transaction,
            lock: transaction.LOCK.UPDATE,
        });

        // Create wallet if not exists
        if (!operatorWallet) {
            operatorWallet = await Wallet.create({
                operatorId: operator.id,
                balance: 0,
                accountType: "Operator",
            }, { transaction, });
        }

        const distributorPreviousBalance = Number(distributorWallet.balance);
        const operatorPreviousBalance = Number(operatorWallet.balance);

        let distributorUpdatedBalance = distributorPreviousBalance;
        let operatorUpdatedBalance = operatorPreviousBalance;

        // CREDIT LOGIC
        // Distributor -> Operator

        if (type === "Credit") {

            // Distributor balance check
            if (distributorPreviousBalance < amount) {
                await transaction.rollback();
                return res.status(400).json({ success: false, message: "You have insufficient balance", });
            }

            // Deduct from distributor
            distributorUpdatedBalance = distributorPreviousBalance - amount;

            // Add to operator
            operatorUpdatedBalance = operatorPreviousBalance + amount;
        }

        // DEBIT LOGIC
        // Operator -> Distributor

        if (type === "Debit") {
            // Operator balance check
            if (operatorPreviousBalance < amount) {
                await transaction.rollback();
                return res.status(400).json({ success: false, message: "Operator has insufficient balance", });
            }

            // Deduct from operator
            operatorUpdatedBalance = operatorPreviousBalance - amount;

            // Add back to distributor
            distributorUpdatedBalance = distributorPreviousBalance + amount;
        }

        // UPDATE WALLET BALANCES
        distributorWallet.balance = distributorUpdatedBalance;
        operatorWallet.balance = operatorUpdatedBalance;

        await distributorWallet.save({ transaction });
        await operatorWallet.save({ transaction });

        // DISTRIBUTOR TRANSACTION
        await WalletTransaction.create({
            transactionId: `WTX${Date.now()}D`,
            walletId: distributorWallet.id,
            amount,
            type: type === "Credit" ? "Debit" : "Credit",
            transactionType: type === "Credit" ? "ADD_FUNDS" : "DEDUCT_FUNDS",
            remainingBalance: distributorUpdatedBalance,
            paymentMode: paymentMode || "Wallet Transfer",
            operatorId: operator.id,
        }, { transaction, });

        // OPERATOR TRANSACTION

        await WalletTransaction.create({
            transactionId: `WTX${Date.now()}O`,
            walletId: operatorWallet.id,
            distributorId,
            amount,
            type,
            transactionType: type === "Credit" ? "ADD_FUNDS" : "DEDUCT_FUNDS",
            remainingBalance: operatorUpdatedBalance,
            paymentMode: paymentMode || "Wallet Transfer",
        }, { transaction, });

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: type === "Credit" ? "Amount transferred to operator successfully" : "Amount returned from operator successfully",
            data: {
                distributorBalance: distributorUpdatedBalance,
                operatorBalance: operatorUpdatedBalance,
            },
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
                { model: User, as: "user", attributes: ["id", "fullName"], },
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

const getOperatorDashboardCards = async (req, res, next) => {
    try {

        const operatorId = req.params.operatorId;

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