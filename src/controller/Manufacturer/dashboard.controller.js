// controller/Dashboard/dashboard.controller.js

const {
    Distributor,
    Operator,
    Terminal,
    User,
} = require("../../models");

const { Op } = require("sequelize");

const getDashboardCards = async (req, res, next) => {

    try {

        // current date
        const now = new Date();

        // first day of month
        const firstDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        // first day of week
        const firstDayOfWeek = new Date();

        firstDayOfWeek.setDate(now.getDate() - now.getDay());

        firstDayOfWeek.setHours(0, 0, 0, 0);

        // distributor
        const totalDistributors = await Distributor.count();

        const newDistributorsThisMonth = await Distributor.count({
            where: {
                createdAt: {
                    [Op.gte]: firstDayOfMonth,
                },
            },
        });

        // operators
        const totalOperators = await Operator.count();

        const newOperatorsThisMonth = await Operator.count({
            where: {
                createdAt: {
                    [Op.gte]: firstDayOfMonth,
                },
            },
        });

        // terminals
        const totalTerminals = await Terminal.count();

        const newTerminalsThisWeek = await Terminal.count({
            where: {
                createdAt: {
                    [Op.gte]: firstDayOfWeek,
                },
            },
        });

        // users
        const totalUsers = await User.count();

        const newUsersThisWeek = await User.count({
            where: {
                createdAt: {
                    [Op.gte]: firstDayOfWeek,
                },
            },
        });

        return res.status(200).json({
            success: true,
            message: "Dashboard cards data",
            data: {
                totalDistributors,
                newDistributorsThisMonth,
                totalOperators,
                newOperatorsThisMonth,
                totalTerminals,
                newTerminalsThisWeek,
                totalUsers,
                newUsersThisWeek,
            },
        });

    } catch (error) {
        next(error);
    }

};

module.exports = {
    getDashboardCards,
};