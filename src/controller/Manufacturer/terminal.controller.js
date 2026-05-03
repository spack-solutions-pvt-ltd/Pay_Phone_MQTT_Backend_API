const { Op } = require("sequelize");
const { Terminal } = require("../../models");

const createTerminal = async (req, res, next) => {

    try {
        const { serialNo, distributorId, operatorId, campus, location, firmwareVersion, } = req.body;

        const existingTerminal = await Terminal.findOne({
            where: { serialNo, },
        });

        if (existingTerminal) {
            return res.status(400).json({
                success: false,
                message: "Serial number already exists",
            });
        }

        const terminalCount = await Terminal.count();

        const terminal = await Terminal.create({
            terminalId: `TRM${1000 + terminalCount + 1}`,
            serialNo,
            distributorId,
            operatorId,
            campus,
            location,
            firmwareVersion,
        });

        return res.status(201).json({
            success: true,
            message: "Terminal created successfully",
            data: terminal,
        });

    } catch (error) {
        next(error);
    }

};

const getAllTerminals = async (req, res, next) => {

    try {

        let { page = 1, limit = 10, search = "", distributorId, operatorId, status, } = req.query;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        const whereCondition = {};

        // distributor filter
        if (distributorId) {
            whereCondition.distributorId = distributorId;
        }

        // operator filter
        if (operatorId) {
            whereCondition.operatorId = operatorId;
        }

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

        const terminal = await Terminal.findByPk(req.params.id);

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

};

const updateTerminal = async (req, res, next) => {
    try {

        const terminal = await Terminal.findByPk(req.params.id);

        if (!terminal) {
            return res.status(404).json({
                success: false,
                message: "Terminal not found",
            });
        }

        await terminal.update(req.body);

        return res.status(200).json({
            success: true,
            message: "Terminal updated successfully",
            data: terminal,
        });

    } catch (error) {
        next(error);
    }

};

module.exports = {
    createTerminal,
    getAllTerminals,
    getTerminalById,
    updateTerminal,
};