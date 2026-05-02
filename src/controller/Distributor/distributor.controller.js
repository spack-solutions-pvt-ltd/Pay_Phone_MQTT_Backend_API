const { Distributor, } = require("../../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const { sendDistributorCredentialsEmail, } = require("../../service/mailService");
const { generatePassword } = require("../../utils/generatePassword");



const createDistributor = async (req, res, next) => {

    try {

        const {
            name,
            email,
            phone,
            companyName,
            gstNumber,
            location,
        } = req.body;

        const existingDistributor = await Distributor.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { phone },
                ],
            },
        });

        if (existingDistributor) {
            return res.status(400).json({
                success: false,
                message: "Distributor already exists",
            });
        }

        const dummyPassword = generatePassword()
        const hashedPassword = await bcrypt.hash(dummyPassword, 10);

        const distributorCount = await Distributor.count();

        const distributor = await Distributor.create({
            distributorId: `DST${1000 + distributorCount + 1}`,
            name,
            email,
            password: hashedPassword,
            phone,
            companyName,
            gstNumber,
            location,
        });

        await sendDistributorCredentialsEmail({
            email,
            dummyPassword,
            name,
        });

        return res.status(201).json({
            success: true,
            message: "Distributor created successfully",
            data: distributor,
        });

    } catch (error) {
        next(error);
    }

};

const getAllDistributors = async (req, res, next) => {

    try {

        let { page = 1, limit = 10, search = "", status, } = req.query;

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        const whereCondition = {};

        if (search) {

            whereCondition[Op.or] = [
                { name: { [Op.like]: `%${search}%`, }, },
                { email: { [Op.like]: `%${search}%`, }, },
                { companyName: { [Op.like]: `%${search}%`, }, },
                { phone: { [Op.like]: `%${search}%`, }, },
            ];

        }

        if (status) {
            whereCondition.status = status;
        }
        if (!req.query.page && !req.query.limit) {
            const distributors = await Distributor.findAll({
                attributes: {
                    exclude: ["password"],
                },
                order: [["id", "DESC"]],
            })
            return res.status(200).json({
                success: true,
                message: "Distributor list",
                data: distributors,
            });
        }

        const { count, rows } = await Distributor.findAndCountAll({
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
            message: "Distributor list",
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

const getDistributorById = async (req, res, next) => {

    try {

        const distributor = await Distributor.findByPk(req.params.id,
            { attributes: { exclude: ["password"], }, }
        );

        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Distributor details",
            data: distributor,
        });

    } catch (error) {
        next(error);
    }

};

const updateDistributor = async (req, res, next) => {
    try {

        const distributor = await Distributor.findByPk(req.params.id);

        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            });
        }

        const updateData = {
            ...req.body,
        };

        await distributor.update(updateData);

        return res.status(200).json({
            success: true,
            message: "Distributor updated successfully",
            data: distributor,
        });

    } catch (error) {
        next(error);
    }

};

module.exports = {
    createDistributor,
    getAllDistributors,
    getDistributorById,
    updateDistributor,
};