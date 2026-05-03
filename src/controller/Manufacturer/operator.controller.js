const { Op } = require("sequelize");

const { Operator, } = require("../../models");

const getOperatorsByDistributorId = async (req, res, next) => {

    try {

        const { distributorId } = req.params;

        let { page = 1, limit = 10, search = "", status, } = req.query;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        const whereCondition = {
            distributorId,
        };

        // search
        if (search) {
            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${search}%`, }, },
                { email: { [Op.like]: `%${search}%`, }, },
                { phone: { [Op.like]: `%${search}%`, }, },
                { companyName: { [Op.like]: `%${search}%`, }, },
                { gstNumber: { [Op.like]: `%${search}%`, }, },
                { location: { [Op.like]: `%${search}%`, }, },
            ];

        }

        // status filter
        if (status) {
            whereCondition.status = status;
        }

        if (!req.query.page && !req.query.limit) {
            const operators = await Operator.findAll({
                where: whereCondition,
                attributes: {
                    exclude: ["password"],
                },
                order: [["id", "DESC"]],
            });
            return res.status(200).json({
                success: true,
                message: "Operator list",
                data: operators,
            });
        }

        const { count, rows } = await Operator.findAndCountAll({
            where: whereCondition,
            attributes: {
                exclude: ["password"],
            },
            limit,
            offset,
            order: [["id", "DESC"]],
        });

        return res.status(200).json({
            success: true,
            message: "Operator list",
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
    getOperatorsByDistributorId,
};