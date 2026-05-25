
const bcrypt = require("bcryptjs");

const { generateAccessToken, } = require("../../helpers/jwtHelper");
const { createRefreshToken, } = require("../../helpers/refreshTokenHandle");

const { Distributor, RefreshToken, Wallet } = require("../../models");

const {
    sendDistributorForgotPasswordEmail,
} = require("../../service/mailService");

const distributorLogin = async (req, res, next) => {

    try {

        const { email, password } = req.body;

        const distributor = await Distributor.findOne({
            where: { email },
        });

        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Invalid email",
            });
        }

        if (distributor.status === "Blocked") {
            return res.status(403).json({
                success: false,
                message: "Account blocked",
            });
        }

        const isPasswordMatched = await bcrypt.compare(
            password,
            distributor.password
        );

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        const accessToken = generateAccessToken(
            distributor.id,
            "Distributor"
        );

        const refreshToken = await createRefreshToken(
            distributor,
            "Distributor"
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                accessToken,
                refreshToken: refreshToken.token,
            },
        });

    } catch (error) {
        next(error);
    }

};

const getDistributorByToken = async (req, res, next) => {

    try {

        const distributor = await Distributor.findByPk(req.distributor.id, {
            attributes: {
                exclude: ["password"],
            },
            include: [{ model: Wallet, as: "wallet", attributes: ['id', 'balance'] }]
        });

        return res.status(200).json({
            success: true,
            message: "Distributor details",
            data: distributor,
        });

    } catch (error) {
        next(error);
    }

};

const distributorLogout = async (req, res, next) => {

    try {

        await RefreshToken.destroy({
            where: {
                userId: req.distributor.id,
                type: "Distributor",
            },
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });

    } catch (error) {
        next(error);
    }

};

const forgotPassword = async (req, res, next) => {

    try {

        const { email } = req.body;

        const distributor = await Distributor.findOne({
            where: { email },
            attributes: ["id", "email"],
        });

        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Email not found",
            });
        }

        const resetToken = await createRefreshToken(
            distributor,
            "Distributor",
            Date.now() + 1000 * 60 * 3
        );

        await sendDistributorForgotPasswordEmail(
            distributor.email,
            resetToken.token
        );

        return res.status(200).json({
            success: true,
            message: "Password reset mail sent successfully",
        });

    } catch (error) {
        next(error);
    }

};

const resetPassword = async (req, res, next) => {

    try {

        const { token } = req.params;

        const { password } = req.body;

        const refreshToken = await RefreshToken.findOne({
            where: {
                token,
                type: "Distributor",
            },
        });

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid reset token",
            });
        }

        if (new Date(refreshToken.expire) < new Date()) {

            await refreshToken.destroy();

            return res.status(400).json({
                success: false,
                message: "Reset token expired",
            });
        }

        const distributor = await Distributor.findByPk(
            refreshToken.userId,
            {
                attributes: ["id", "email", "password"],
            }
        );

        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        distributor.password = hashedPassword;

        await distributor.save();

        await refreshToken.destroy();

        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        });

    } catch (error) {
        next(error);
    }

};

module.exports = {
    distributorLogin,
    distributorLogout,
    getDistributorByToken,
    forgotPassword,
    resetPassword,
};