const { Op } = require("sequelize");
const { Terminal } = require("../../models");
const { unblockTerminal, blockTerminal } = require("../../MQTT/mqttHandle");

const createDistributorTerminal = async (req, res, next) => {
    try {
        const distributorId = req.distributor.id;

        const { terminalId, operatorId, campus, location, } = req.body;

        const existingTerminal = await Terminal.findOne({
            where: { terminalId, },
            attributes: ["id", "terminalId",],
        });

        if (existingTerminal) {
            return res.status(400).json({
                success: false,
                message: "Serial number already exists",
            });
        }

        const terminalCount = await Terminal.count();

        const terminal = await Terminal.create({
            terminalId: terminalId,
            distributorId,
            operatorId,
            campus,
            location,
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

const getAllDistributorTerminals = async (req, res, next) => {
    try {

        let { page = 1, limit = 10, search = "", operatorId, status, } = req.query;
        const distributorId = req.distributor.id;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        const whereCondition = { distributorId };

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

const getDistributorTerminalById = async (req, res, next) => {
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

const updateDistributorTerminal = async (req, res, next) => {
    try {

        const terminal = await Terminal.findByPk(req.params.id);

        if (!terminal) {
            return res.status(404).json({
                success: false,
                message: "Terminal not found",
            });
        }

        const existingTerminal = await Terminal.findOne({
            where: {
                terminalId: req.body.terminalId,
                id: { [Op.ne]: terminal.id },
            },
            attributes: ["id", "terminalId",],
        });

        if (existingTerminal) {
            return res.status(400).json({
                success: false,
                message: "Terminal Id already exists",
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

const statusUpdateDistributorTerminal = async (req, res, next) => {
    try {
        const { status } = req.body;
        const terminal = await Terminal.findByPk(req.params.id);

        if (!terminal) {
            return res.status(404).json({
                success: false,
                message: "Terminal not found",
            });
        }

        if (status == "Blocked") {
            await blockTerminal(terminal.terminalId)
        } else {
            await unblockTerminal(terminal.terminalId)
        }

        // await terminal.update({ status });

        return res.status(200).json({
            success: true,
            message: `Terminal Request to ${status}`,
            data: terminal,
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    createDistributorTerminal,
    getAllDistributorTerminals,
    getDistributorTerminalById,
    updateDistributorTerminal,
    statusUpdateDistributorTerminal,
};