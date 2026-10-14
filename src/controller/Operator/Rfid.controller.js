const { Op } = require("sequelize");
const { RFIDCard, User, CallLog } = require("../../models");

const createUserRfid = async (req, res, next) => {
    try {
        const operatorId = req.operator.id;

        const { cardNumber, userId, note } = req.body;

        const existRfid = await RFIDCard.findOne({
            where: { cardNumber, }
        })

        if (existRfid) {
            return res.status(400).json({
                success: false, message: "RFID card already exists",
            });
        }

        const rfidCard = await RFIDCard.create({
            cardNumber: cardNumber,
            userId,
            operatorId,
            note
        });

        return res.status(201).json({
            success: true,
            message: "RFID card created successfully",
            data: rfidCard,
        });
    } catch (error) {
        next(error);
    }
}

const updateRfidById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rfidCard = await RFIDCard.findByPk(id);
        if (!rfidCard) {
            return res.status(404).json({
                success: false,
                message: "RFID card not found",
            });
        }
        const callLog = await CallLog.findOne({
            where: {
                cid: rfidCard.cardNumber,
            },
            attributes: ["id"],
        });

        if (callLog) {
            return res.status(400).json({
                success: false,
                message: "Cannot update RFID card because call logs exist",
            });
        }

        await rfidCard.update(req.body);

        return res.status(200).json({
            success: true,
            message: "RFID card update successfully",
            data: rfidCard,
        });
    } catch (error) {
        next(error);
    }
}

const getRfidById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rfidCard = await RFIDCard.findByPk(id);
        if (!rfidCard) {
            return res.status(404).json({
                success: false,
                message: "RFID card not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "RFID card deleted successfully",
            data: rfidCard,
        });
    } catch (error) {
        next(error);
    }
}

const getAllRfids = async (req, res, next) => {
    try {
        const operatorId = req.operator.id;

        let { page = 1, limit = 10, search = "", status, } = req.query;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        const whereCondition = { operatorId };

        // search
        if (search) {
            whereCondition[Op.or] = [
                { cardNumber: { [Op.like]: `%${search}%`, }, },
                { '$user.userId$': { [Op.like]: `%${search}%` } },
                { '$user.fullName$': { [Op.like]: `%${search}%` } },
            ];
        }

        if (status) {
            whereCondition.status = status;
        }

        const { count, rows, } = await RFIDCard.findAndCountAll({
            where: whereCondition,
            include: [
                {
                    model: User, as: "user",
                    attributes: ["id", "userId", "fullName", "phone",],
                },
            ],
            limit,
            offset,
            order: [["id", "DESC"],],
        });

        return res.status(200).json({
            success: true,
            message: "RFID card list",
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

const deleteRfidById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const rfidCard = await RFIDCard.findByPk(id);

        if (!rfidCard) {
            return res.status(404).json({
                success: false,
                message: "RFID card not found",
            });
        }
        const callLog = await CallLog.findOne({
            where: {
                cid: rfidCard.cardNumber,
            },
            attributes: ["id"],
        });

        if (callLog) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete RFID card because call logs exist",
            });
        }

        // Delete if no call log exists
        await rfidCard.destroy();

        return res.status(200).json({
            success: true,
            message: "RFID card deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};



module.exports = {
    createUserRfid,
    updateRfidById,
    getRfidById,
    getAllRfids,
    deleteRfidById
}