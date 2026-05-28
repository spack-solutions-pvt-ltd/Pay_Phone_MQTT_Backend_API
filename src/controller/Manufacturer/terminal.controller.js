const { Op } = require("sequelize");
const { Terminal, Distributor, Operator } = require("../../models");
const { unblockTerminal, blockTerminal } = require("../../MQTT/mqttHandle");

const createTerminal = async (req, res, next) => {

    try {
        const { terminalId, distributorId, operatorId, campus, location, } = req.body;

        const existingTerminal = await Terminal.findOne({
            where: { terminalId, },
            attributes: ["id", "terminalId",],
        });

        if (existingTerminal) {
            return res.status(400).json({
                success: false,
                message: "Terminal Id already exists",
            });
        }

        const terminalCount = await Terminal.count();

        const terminal = await Terminal.create({
            terminalId,
            distributorId,
            operatorId: operatorId || null,
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
            include: [
                { model: Distributor, as: "distributor", attributes: ["id", "name", "distributorId"] },
                { model: Operator, as: "operator", attributes: ["id", "name", "operatorId"] }],
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


const statusUpdateTerminal = async (req, res, next) => {
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

const bulkCreateTerminal = async (req, res, next) => {
    try {
        const { distributorId, terminals = [] } = req.body;

        const distributor = await Distributor.findByPk(distributorId, {
            attributes: ["id", "name", "distributorId"],
        });

        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            });
        }

        if (!Array.isArray(terminals) || terminals.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Terminals array is required",
            });
        }

        // PREPARE DATA
        const terminalData = terminals.map((item) => ({
            terminalId: item.terminalId,
            distributorId,
            simNo: item.simNo || null,
            serialNo: item.serialNo || null,
            campus: item.campus || null,
            location: item.location || null,
        }));

        // REMOVE DUPLICATE terminalIds FROM REQUEST
        const uniqueTerminalMap = new Map();

        terminalData.forEach((item) => {
            uniqueTerminalMap.set(item.terminalId, item);
        });

        const uniqueTerminals = [...uniqueTerminalMap.values()];

        // CHECK EXISTING terminalIds
        const existingTerminals = await Terminal.findAll({
            where: {
                terminalId: uniqueTerminals.map((t) => t.terminalId),
            },
            attributes: ["terminalId"],
        });

        const existingIds = existingTerminals.map((t) => t.terminalId);

        // FILTER NEW TERMINALS ONLY
        const newTerminals = uniqueTerminals.filter(
            (t) => !existingIds.includes(t.terminalId)
        );

        if (newTerminals.length === 0) {
            return res.status(400).json({
                success: false,
                message: "All terminalIds already exist",
            });
        }

        // BULK CREATE
        const createdTerminals = await Terminal.bulkCreate(newTerminals);

        return res.status(201).json({
            success: true,
            message: `${createdTerminals.length} terminals created successfully`,
            data: {
                createdTerminals,
                skippedTerminalIds: existingIds,
            }
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
    statusUpdateTerminal,
    bulkCreateTerminal,
};