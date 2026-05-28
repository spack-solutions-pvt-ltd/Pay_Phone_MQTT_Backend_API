const { Op } = require("sequelize");
const { Operator, Terminal, User, Wallet, } = require("../../models");
const moment = require("moment");

const distributorDashboard = async (req, res, next) => {
    try {

        const distributorId = req.distributor.id;
        // current dates
        const startOfMonth = moment().startOf("month").toDate();
        const startOfWeek = moment().startOf("week").toDate();

        const operators = await Operator.findAll({
            where: { distributorId },
            attributes: ["id",],
        });

        // operators added this month
        const newOperatorsThisMonth = await Operator.count({
            where: {
                distributorId,
                createdAt: {
                    [Op.gte]: startOfMonth
                }
            }
        });

        // total terminals
        const totalTerminals = await Terminal.count({
            where: { distributorId }
        });

        // terminals added this month
        const newTerminalsThisMonth = await Terminal.count({
            where: {
                distributorId,
                createdAt: {
                    [Op.gte]: startOfMonth
                }
            }
        });


        const operatorIds = operators.map(op => op.id);
        // total users
        const totalUsers = await User.count({
            where: {
                operatorId: { [Op.in]: operatorIds }
            }
        });

        // users added this week
        const newUsersThisWeek = await User.count({
            where: {
                operatorId: { [Op.in]: operatorIds },
                createdAt: {
                    [Op.gte]: startOfWeek
                }
            }
        });

        // wallet 
        const wallet = await Wallet.findOne({
            where: {
                accountType: "Distributor",
                distributorId
            },
            attributes: ["balance"],
        });

        // active terminals
        const activeTerminals = await Terminal.count({
            where: {
                distributorId: req.distributor.id,
                status: "Active"
            }
        });

        // inactive terminals
        const inactiveTerminals = await Terminal.count({
            where: {
                distributorId: req.distributor.id,
                status: { [Op.ne]: "Active" }
            }
        });

        // uptime percentage
        const uptime = totalTerminals > 0 ? ((activeTerminals / totalTerminals) * 100).toFixed(1) : 0;

        // needs attention level
        let attentionLevel = "Low";

        if (inactiveTerminals > 50) {
            attentionLevel = "High";
        } else if (inactiveTerminals > 20) {
            attentionLevel = "Medium";
        }

        return res.status(200).json({
            success: true,
            data: {
                newOperatorsThisMonth,
                totalOperators: operators.length,
                totalTerminals,
                newTerminalsThisMonth,
                totalUsers,
                newUsersThisWeek,
                walletBalance: wallet ? wallet.balance : 0,
                activeTerminals,
                inactiveTerminals,
                uptimePercentage: uptime,
                attentionLevel,
            }
        });

    } catch (error) {
        next(error);
    }
};

const getUnavailableTerminals = async (req, res, next) => {
    try {
        const distributorId = req.distributor.id;
        const unavailableTerminals = await Terminal.findAll({
            where: {
                distributorId,
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
    distributorDashboard,
    getUnavailableTerminals
};

