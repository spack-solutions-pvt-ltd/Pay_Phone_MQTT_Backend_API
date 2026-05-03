const { Op } = require("sequelize");
const { Terminal, CallLog, User } = require("../../models");

const getAllOperatorTerminals = async (req, res, next) => {
    try {

        let { page = 1, limit = 10, search = "", status, } = req.query;
        const operatorId = req.operator.id;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        const whereCondition = { operatorId };

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
                { location: { [Op.like]: `%${search}%`, }, },
                { firmwareVersion: { [Op.like]: `%${search}%`, }, },
            ];

        }

        const { count, rows } = await Terminal.findAndCountAll({
            where: whereCondition,
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
};

const getTerminalById = async (req, res, next) => {
    try {
        const operatorId = req.operator.id;
        const terminalId = req.params.terminalId;
        const terminal = await Terminal.findOne({
            where: {
                id: terminalId,
                operatorId,
            },
        });
        if (!terminal) {
            return res.status(404).json({
                success: false,
                message: "Terminal not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Terminal details",
            data: terminal,
        });

    } catch (error) {
        next(error);
    }
}

const getCallListByTerminalId = async (req, res, next) => {
    try {
        const terminalId = req.params.terminalId;
        const operatorId = req.operator.id;
        let { page = 1, limit = 10, search = "", status, startDate, endDate } = req.query;
        page = Number(page);
        limit = Number(limit);
        const offset = (page - 1) * limit;

        const terminal = await Terminal.findOne({
            where: {
                id: terminalId,
                operatorId,
            },
            attributes: ["id"],
        });

        if (!terminal) {
            return res.status(404).json({
                success: false,
                message: "Terminal not found",
            });
        }
        const whereCondition = { terminalId };

        // status filter
        if (status) {
            whereCondition.status = status;
        }

        // search
        if (search) {

            whereCondition[Op.or] = [
                { caller: { [Op.like]: `%${search}%`, }, },
                { receiver: { [Op.like]: `%${search}%`, }, },
                { callType: { [Op.like]: `%${search}%`, }, },
            ];

        }

        if (startDate && endDate) {
            whereCondition.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        const { count, rows } = await CallLog.findAndCountAll({
            where: whereCondition,
            include: [
                { model: User, as: "user", attributes: ["id", "name", "userId"] },
            ],
            limit,
            offset,
            order: [["id", "DESC"]],
        })
        return res.status(200).json({
            success: true,
            message: "Call list",
            data: callList,
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllOperatorTerminals,
    getTerminalById,
    getCallListByTerminalId,
};