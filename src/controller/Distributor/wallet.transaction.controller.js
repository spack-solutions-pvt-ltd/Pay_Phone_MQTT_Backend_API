const { Op } = require("sequelize");
const { WalletTransaction, Wallet, Operator } = require("../../models");

const getDistributorWalletTransactions = async (req, res, next) => {
    try {
        const distributorId = req.distributor.id;

        let { page = 1, limit = 10, operatorId, type, transactionType, search = "", } = req.query;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        const whereCondition = {
            distributorId,
        };

        if (operatorId) {
            const wallet = await Wallet.findOne({
                where: {
                    operatorId,
                    accountType: "Operator",
                },
                attributes: ["id"],
            });

            whereCondition.walletId = wallet.id;
        }

        if (type) {
            whereCondition.type = type;
        }

        if (transactionType) {
            whereCondition.transactionType = transactionType;
        }

        if (search) {
            whereCondition[Op.or] = [
                { transactionId: { [Op.like]: `%${search}%`, }, },
                { paymentMode: { [Op.like]: `%${search}%`, }, },
            ];
        }

        const { count, rows } = await WalletTransaction.findAndCountAll({
            where: whereCondition,
            include: [{
                model: Wallet, as: "wallet", attributes: ["id", "operatorId"],
                include: [{
                    model: Operator, as: "operator",
                    attributes: ["id", "name", "operatorId"]
                }]
            }],
            limit,
            offset,
            order: [["id", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            message: "Wallet transaction list",
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

module.exports = {
    getDistributorWalletTransactions,
};