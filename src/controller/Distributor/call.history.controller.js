
const { Op } = require("sequelize");
const {
    CallLog,
    User,
    Operator,

} = require("../../models");


const getAllCallHistory = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 10,
            search = "",
            operatorId,
        } = req.query;

        page = Math.max(1, parseInt(page, 10) || 1);
        limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));

        const offset = (page - 1) * limit;
        const searchValue = String(search).trim();
        const distributorId = req.distributor.id;

        const callLogWhere = {};
        const operatorWhere = {
            distributorId,
        };

        // Filter by Operator primary key (Operator.id)
        if (operatorId) {
            operatorWhere.id = operatorId;
        }

        // Search across call log, user, and operator fields
        if (searchValue) {
            const like = {
                [Op.like]: `%${searchValue}%`,
            };

            callLogWhere[Op.or] = [
                { phoneNumber: like },
                { callerId: like },
                { cid: like },
                { tid: like },
                { "$user.fullName$": like },
                { "$user.phone$": like },
                { "$user.operator.operatorId$": like },
            ];
        }

        const { count, rows } = await CallLog.findAndCountAll({
            attributes: [
                "id",
                "phoneNumber",
                "callerId",
                "status",
                "duration",
                "startTime",
                "endTime",
                "cid",
                "tid",
            ],

            where: callLogWhere,

            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "fullName",
                        "phone",
                    ],
                    required: true,

                    include: [
                        {
                            model: Operator,
                            as: "operator",
                            attributes: [
                                "id",
                                "operatorId",
                                "distributorId",
                                "name",
                            ],
                            required: true,
                            where: operatorWhere,
                        },
                    ],
                },
            ],

            distinct: true,
            subQuery: false,
            order: [["createdAt", "DESC"]],
            limit,
            offset,
        });

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Distributor call history fetched successfully",
            data: rows,
            pagination: {
                total: count,
                currentPage: page,
                totalPages: Math.ceil(count / limit),
                limit,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to fetch call history",
            error: error.message,
        });
    }
};

module.exports = { getAllCallHistory };
