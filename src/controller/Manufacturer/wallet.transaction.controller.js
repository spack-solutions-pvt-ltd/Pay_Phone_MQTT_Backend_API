const { Op } = require("sequelize");
const { WalletTransaction, Wallet, Distributor } = require("../../models");


const getWalletTransactions = async (req, res, next) => {
    try {
        const manufacturerId = req.manufacturer.id;

        let { page = 1, limit = 10, distributorId, type, transactionType, search = "", } = req.query;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;


        const whereCondition = {
            manufacturerId,
        };

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

        if (distributorId) {
            whereCondition["$wallet.distributor.id$"] = distributorId;
        }

        const { count, rows } = await WalletTransaction.findAndCountAll({
            where: whereCondition,
            include: [{
                model: Wallet, as: "wallet",
                attributes: ["id", "accountType", "distributorId"],
                include: [{
                    model: Distributor, as: "distributor",
                    attributes: ["id", "name", "distributorId"]
                }],
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
    getWalletTransactions,
};