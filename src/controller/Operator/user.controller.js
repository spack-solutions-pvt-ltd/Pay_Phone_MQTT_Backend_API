const { Op } = require("sequelize");
const { sequelize, User, UserAssociatedNumber, UserActiveDay, Wallet, RFIDCard, CallLog, WalletTransaction } = require("../../models");



const getAllUsers = async (req, res, next) => {
    try {
        const operatorId = req.operator.id;

        let { page = 1, limit = 10, search = "", status, } = req.query;

        page = Number(page);

        limit = Number(limit);

        const offset = (page - 1) * limit;

        const whereCondition = { operatorId, };

        // search
        if (search) {
            whereCondition[Op.or] = [
                { fullName: { [Op.like]: `%${search}%`, }, },
                { userId: { [Op.like]: `%${search}%`, }, },
            ];

        }

        // status
        if (status) {
            whereCondition.status = status;
        }

        const { count, rows } = await User.findAndCountAll({
            where: whereCondition,
            include: [{ model: Wallet, as: "wallet", },],
            limit,
            offset,
            order: [["id", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            message: "User list",
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

const getUserById = async (req, res, next) => {
    try {

        const user = await User.findOne({
            where: {
                id: req.params.id,
                operatorId: req.operator.id,
            },
            include: [
                { model: UserAssociatedNumber, as: "associatedNumbers", },
                { model: UserActiveDay, as: "activeDays", },
                { model: Wallet, as: "wallet", },
                // { model: RFIDCard, as: "rfidCards" }
            ],
        });

        return res.status(200).json({
            success: true,
            message: "User details",
            data: user,
        });

    } catch (error) {
        next(error);
    }

};


const createUser = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const operatorId = req.operator.id;
        const {
            fullName, phone, callDurationLimit, activeFrom, activeTo, associatedNumbers, activeDays,
        } = req.body;

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { phone: phone },
                    { fullName: fullName },
                ],
            },
            transaction,
        });

        if (existingUser) {
            await transaction.rollback();
            return res.status(400).json({
                success: false, message: "User already exists",
            });
        }

        const userCount = await User.count();
        const user = await User.create({
            userId: `USR${1000 + userCount + 1}`,
            operatorId,
            fullName,
            phone,
            callDurationLimit,
            activeFrom,
            activeTo,
        }, { transaction, });

        // associated numbers
        if (associatedNumbers && associatedNumbers.length > 0) {
            const numbers = associatedNumbers.map(
                (number) => ({ userId: user.id, phoneNumber: number }));
            await UserAssociatedNumber.bulkCreate(numbers, { transaction, });
        }

        // active days
        if (activeDays && activeDays.length > 0) {
            const days = activeDays.map((day) => ({ userId: user.id, day, }));
            await UserActiveDay.bulkCreate(days, { transaction, });
        }

        // create wallet
        await Wallet.create({
            userId: user.id,
            balance: 0,
            accountType: "User",
        }, { transaction, });

        await transaction.commit();

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id,
                operatorId: req.operator.id,
            },
            transaction,
        });

        if (!user) {
            await transaction.rollback();
            return res.status(404).json({ success: false, message: "User not found", });
        }

        const { associatedNumbers, activeDays, ...updateData } = req.body;

        await user.update(updateData, { transaction, });

        // update associated numbers
        if (associatedNumbers) {

            // existing numbers
            const existingNumbers = await UserAssociatedNumber.findAll({
                where: { userId: user.id },
                transaction,
            });

            const existingPhoneNumbers = existingNumbers.map(n => n.phoneNumber);

            // incoming numbers
            const incomingNumbers = associatedNumbers;

            // numbers to add
            const numbersToAdd = incomingNumbers.filter(
                number => !existingPhoneNumbers.includes(number)
            );

            // numbers to remove
            const numbersToRemove = existingNumbers.filter(
                n => !incomingNumbers.includes(n.phoneNumber)
            );

            // add new numbers
            if (numbersToAdd.length > 0) {
                const newNumbers = numbersToAdd.map(number => ({
                    userId: user.id,
                    phoneNumber: number,
                }));

                await UserAssociatedNumber.bulkCreate(newNumbers, {
                    transaction,
                });
            }
        }

        // update active days
        if (activeDays) {

            await UserActiveDay.destroy({ where: { userId: user.id }, transaction, });

            const days = activeDays.map((day) => ({ userId: user.id, day, }));

            await UserActiveDay.bulkCreate(days, { transaction, });

        }

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};


const getAllRfidCardsByUserId = async (req, res, next) => {
    try {
        const rfidCards = await RFIDCard.findAll({
            where: {
                userId: req.params.id
            }
        });
        return res.status(200).json({
            success: true,
            message: "RFID cards",
            data: rfidCards
        });
    } catch (error) {
        next(error);
    }
}


const userWalletTransaction = async (req, res, next) => {
    try {
        const userId = req.params.id;

        let { page = 1, limit = 10, search = "", type, } = req.query;
        page = Number(page);
        limit = Number(limit);
        const offset = (page - 1) * limit;

        const wallet = await Wallet.findOne({
            where: {
                userId: req.params.id,
                accountType: "User"
            }
        });

        let whereCondition = { walletId: wallet.id };
        if (type) { whereCondition.type = type; }

        if (search) {
            whereCondition[Op.or] = [
                { transactionId: { [Op.like]: `%${search}%`, }, },
            ];
        }


        const { count, rows } = await WalletTransaction.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            message: "Wallet transactions for user",
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

const userCallLogsList = async (req, res, next) => {
    try {
        const userId = req.params.id;
        let { page = 1, limit = 10, search = "", type, } = req.query;
        page = Number(page);
        limit = Number(limit);
        const offset = (page - 1) * limit;
        let whereCondition = { userId: userId };
        if (type) { whereCondition.type = type; }

        if (search) {
            whereCondition[Op.or] = [
                { callerId: { [Op.like]: `%${search}%`, }, },
                { phoneNumber: { [Op.like]: `%${search}%`, }, },
            ];
        }

        const { count, rows: callLogs } = await CallLog.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [["createdAt", "DESC"]],
        })
        return res.status(200).json({
            success: true,
            message: "Call logs for user",
            data: callLogs,
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
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    getAllRfidCardsByUserId,
    userWalletTransaction,
    userCallLogsList
};