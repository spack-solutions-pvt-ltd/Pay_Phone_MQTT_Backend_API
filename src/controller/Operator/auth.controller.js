
const bcrypt = require("bcryptjs");
const { generateAccessToken, } = require("../../helpers/jwtHelper");
const { createRefreshToken, } = require("../../helpers/refreshTokenHandle");
const { Operator, RefreshToken, Wallet } = require("../../models");
const { sendOperatorForgotPasswordEmail, } = require("../../service/mailService");

const operatorLogin = async (req, res, next) => {

    try {

        const { email, password } = req.body;

        const operator = await Operator.findOne({
            where: { email },
        });

        if (!operator) {
            return res.status(404).json({
                success: false,
                message: "Invalid email",
            });
        }

        if (operator.status === "Blocked") {
            return res.status(403).json({
                success: false,
                message: "Account blocked",
            });
        }

        const isPasswordMatched = await bcrypt.compare(
            password,
            operator.password
        );

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        const accessToken = generateAccessToken(
            operator.id,
            "Operator"
        );

        const refreshToken = await createRefreshToken(
            operator,
            "Operator"
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

const getOperatorByToken = async (req, res, next) => {

    try {

        const operator = await Operator.findByPk(req.operator.id,
            {
                attributes: { exclude: ["password"], },
                include: { model: Wallet, as: "wallet" },
            }
        );

        return res.status(200).json({
            success: true,
            message: "Operator details",
            data: operator,
        });

    } catch (error) {
        next(error);
    }

};

const operatorLogout = async (req, res, next) => {

    try {

        await RefreshToken.destroy({
            where: {
                userId: req.operator.id,
                type: "Operator",
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

        const operator = await Operator.findOne({
            where: { email },
            attributes: ["id", "email"],
        });

        if (!operator) {
            return res.status(404).json({
                success: false,
                message: "Email not found",
            });
        }

        const resetToken = await createRefreshToken(
            operator,
            "Operator",
            Date.now() + 1000 * 60 * 3
        );

        await sendOperatorForgotPasswordEmail(
            operator.email,
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
                type: "Operator",
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

        const operator = await Operator.findByPk(
            refreshToken.userId,
            {
                attributes: ["id", "email", "password"],
            }
        );

        if (!operator) {
            return res.status(404).json({
                success: false,
                message: "Operator not found",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        operator.password = hashedPassword;

        await operator.save();

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
    operatorLogin,
    operatorLogout,
    getOperatorByToken,
    forgotPassword,
    resetPassword,
};