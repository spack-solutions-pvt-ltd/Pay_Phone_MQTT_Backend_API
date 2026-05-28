
const { Terminal, User, Wallet } = require("../..//models");
const { Op } = require("sequelize");

const getOperatorDashboardCards = async (req, res, next) => {

    try {
        const operatorId = req.operator.id;
        const startOfWeek = new Date();

        startOfWeek.setDate(startOfWeek.getDate() - 7);

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        // total terminals
        const totalTerminals = await Terminal.count({
            where: { operatorId, },
        });

        // active terminals
        const activeTerminals = await Terminal.count({
            where: {
                operatorId,
                status: "Active",
            },
        });

        // active terminals this week
        const activeTerminalsThisWeek = await Terminal.count({
            where: {
                operatorId, status: "Active",
                updatedAt: { [Op.gte]: startOfWeek, },
            },
        });

        // total users
        const totalUsers = await User.count({
            where: { operatorId, },
        });

        // users added this month
        const usersThisMonth = await User.count({
            where: {
                operatorId,
                createdAt: { [Op.gte]: startOfMonth, },
            },
        });

        const wallet = await Wallet.findOne({
            where: {
                operatorId,
                accountType: "Operator",
            },
            attributes: ["balance",],
        });

        return res.status(200).json({
            success: true,
            message: "Dashboard cards data",
            data: {
                totalTerminals,
                activeTerminals,
                activeTerminalsThisWeek,
                totalUsers,
                usersThisMonth,
                walletBalance: wallet?.balance || 0,
            },

        });

    } catch (error) {
        next(error);
    }
};

const getUnavailableTerminals = async (req, res, next) => {
    try {
        const operatorId = req.operator.id;
        const unavailableTerminals = await Terminal.findAll({
            where: {
                operatorId,
                status: { [Op.ne]: "Active", },
            },
            include: [
                { model: Operator, as: "operator", attributes: ["id", "name"] }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Unavailable Terminals",
            data: unavailableTerminals,
        });
    } catch (error) {
        next(error);
    }
}
module.exports = {
    getOperatorDashboardCards,
    getUnavailableTerminals
};