const { sequelize, User, Wallet, WalletTransaction, } = require("../../models");

const rechargeUserWallet = async (req, res, next) => {

    const transaction = await sequelize.transaction();

    try {
        const operatorId = req.operator.id;

        const { userId, amount, type, paymentMode, } = req.body;

        // validate type
        if (!["Credit", "Debit"].includes(type)) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Invalid transaction type",
            });
        }

        // validate amount
        if (!amount || Number(amount) <= 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Amount must be greater than 0",
            });
        }

        // operator wallet
        const operatorWallet = await Wallet.findOne({
            where: {
                operatorId,
                accountType: "Operator",
            },
            transaction,
        });

        if (!operatorWallet) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: "Operator wallet not found", });
        }

        if (type === "Credit" && Number(amount) > Number(operatorWallet.balance)) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance",
            });
        }

        // user validation
        const user = await User.findOne({
            where: {
                id: userId,
                operatorId,
            },
            transaction,
        });

        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: "User not found", });
        }

        // user wallet
        let userWallet = await Wallet.findOne({
            where: {
                userId: user.id,
                accountType: "User",
            },
            transaction,
        });

        // create wallet if not exists
        if (!userWallet) {
            userWallet = await Wallet.create({
                userId: user.id,
                balance: 0,
                accountType: "User",
            }, { transaction, });
        }

        const operatorPreviousBalance = Number(operatorWallet.balance);

        const userPreviousBalance = Number(userWallet.balance);

        let operatorUpdatedBalance = operatorPreviousBalance;

        let userUpdatedBalance = userPreviousBalance;

        // CREDIT USER WALLET
        if (type === "Credit") {

            // operator balance check
            if (Number(amount) > operatorPreviousBalance) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false,
                    message: "Insufficient operator wallet balance",
                });
            }

            // deduct operator wallet
            operatorUpdatedBalance = operatorPreviousBalance - Number(amount);

            // add user wallet
            userUpdatedBalance = userPreviousBalance + Number(amount);

            // update operator wallet
            operatorWallet.balance = operatorUpdatedBalance;

            await operatorWallet.save({
                transaction,
            });

            // operator wallet transaction
            await WalletTransaction.create({
                transactionId: `OTX${Date.now()}`,
                walletId: operatorWallet.id,
                amount,
                type: "Debit",
                remainingBalance: operatorUpdatedBalance,
                transactionType: "TRANSFER_TO_USER",
                paymentMode,
            }, { transaction, });

        }

        // DEBIT USER WALLET
        if (type === "Debit") {

            // user balance check
            if (Number(amount) > userPreviousBalance) {
                await transaction.rollback();
                return res.status(400).json({
                    success: false, message: "Insufficient user wallet balance",
                });
            }

            // deduct user wallet
            userUpdatedBalance = userPreviousBalance - Number(amount);

            // add operator wallet
            operatorUpdatedBalance = operatorPreviousBalance + Number(amount);

            // update operator wallet
            operatorWallet.balance = operatorUpdatedBalance;

            await operatorWallet.save({
                transaction,
            });

            // operator wallet transaction
            await WalletTransaction.create({
                transactionId: `OPTX${Date.now()}`,
                walletId: operatorWallet.id,
                amount,
                type: "Credit",
                remainingBalance: operatorUpdatedBalance,
                transactionType: "RECEIVED_FROM_USER",
                paymentMode,
            }, { transaction, });

        }

        // update user wallet
        userWallet.balance = userUpdatedBalance;

        await userWallet.save({
            transaction,
        });

        // user wallet transaction
        await WalletTransaction.create({
            transactionId: `UTX${Date.now()}`,
            walletId: userWallet.id,
            amount,
            type,
            remainingBalance: userUpdatedBalance,
            transactionType: type === "Credit" ? "ADD_FUNDS" : "DEDUCT_FUNDS",
            operatorId,
            paymentMode,
        }, {
            transaction,
        });

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

module.exports = {
    rechargeUserWallet,
};