
const { generateAccessToken } = require("../../helpers/jwtHelper");
const { createRefreshToken } = require("../../helpers/refreshTokenHandle");
const { Manufacturer, RefreshToken } = require("../../models");
const bcrypt = require("bcryptjs");
const { sendManufacturerForgotPasswordEmail } = require("../../service/mailService");

const manufacturerLogin = async (req, res, next) => {

    try {

        const { email, password } = req.body;

        const manufacturer = await Manufacturer.findOne({
            where: { email },
        });

        if (!manufacturer) {
            return res.status(404).json({
                success: false,
                message: "Invalid email",
            });
        }

        if (manufacturer.status === "Blocked") {
            return res.status(403).json({
                success: false,
                message: "Account blocked",
            });
        }

        const isPasswordMatched = await bcrypt.compare(
            password,
            manufacturer.password
        );

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }

        const accessToken = generateAccessToken(
            manufacturer.id,
            "Manufacturer"
        );

        const refreshToken = await createRefreshToken(
            manufacturer,
            "Manufacturer"
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


const getManufacturerByToken = async (req, res, next) => {
    try {
        const manufacturer = await Manufacturer.findByPk(req.manufacturer.id, {
            attributes: { exclude: ["password"] },
        });

        return res.status(200).json({
            success: true,
            message: "Manufacturer details",
            data: manufacturer
        });

    } catch (error) {
        next(error);
    }
}
const manufacturerLogout = async (req, res, next) => {
    try {

        await RefreshToken.destroy({
            where: {
                userId: req.manufacturer.id,
                type: "Manufacturer",
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

        const manufacturer = await Manufacturer.findOne({
            where: { email },
            attributes: ["id", "email"],
        });

        if (!manufacturer) {
            return res.status(404).json({
                success: false, message: "Email not found",
            });
        }

        const resetToken = await createRefreshToken(manufacturer, "Manufacturer", Date.now() + 1000 * 60 * 3);


        await sendManufacturerForgotPasswordEmail(manufacturer.email, resetToken.token);

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
                token: token,
                type: "Manufacturer",
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

        const manufacturer = await Manufacturer.findByPk(
            refreshToken.userId,{
                attributes: ["id", "email", "password"],
            }
        );

        if (!manufacturer) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer not found",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        manufacturer.password = hashedPassword;

        await manufacturer.save();

        // remove used token`
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
    manufacturerLogin,
    manufacturerLogout,
    getManufacturerByToken,
    forgotPassword,
    resetPassword
};