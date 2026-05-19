const { RefreshToken } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { generateAccessToken } = require("./jwtHelper");

const createRefreshToken = async (user, type, expiryTime = Date.now() + 1000 * 60 * 60 * 24 * 1) => {

    await RefreshToken.destroy({
        where: {
            userId: user.id,
            type,
        },
    });

    let token = uuidv4();
    let expiryDate = expiryTime || Date.now() + 1000 * 60 * 60 * 24 * 1;

    let refreshToken = await RefreshToken.create({
        token: token,
        userId: user.id,
        expire: expiryDate,
        type: type
    })
    // }
    return refreshToken;
}

const manufacturerRefreshTokenHandler = async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return res.status(200).json({ success: false, message: "Token required" });
        }

        const refToken = await RefreshToken.findOne({
            where: { token: refreshToken, type: 'Manufacturer' },
        });

        if (!refToken) {
            return res.status(404).json({ success: false, message: "Invalid refresh token" });
        }

        if (refToken.expiry_date < Date.now()) {
            await refToken.destroy();
            return res.status(404).json({ success: false, message: "Refresh token has expired" });
        }

        const accessToken = generateAccessToken(refToken.userId, 'Manufacturer');

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: accessToken,
        });

    } catch (error) {
        console.error("Error refreshing access token:", error);
        next(error);
    }


}

const distributorRefreshTokenHandler = async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return res.status(200).json({ success: false, message: "Token required" });
        }

        const refToken = await RefreshToken.findOne({
            where: { token: refreshToken, type: 'Distributor' },
        });

        if (!refToken) {
            return res.status(404).json({ success: false, message: "Invalid refresh token" });
        }

        if (refToken.expiry_date < Date.now()) {
            await refToken.destroy();
            return res.status(404).json({ success: false, message: "Refresh token has expired" });
        }

        const accessToken = generateAccessToken(refToken.userId, 'Distributor');

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: accessToken,
        });

    } catch (error) {
        console.error("Error refreshing access token:", error);
        next(error);
    }


}

const operatorRefreshTokenHandler = async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken;

        if (!refreshToken) {
            return res.status(200).json({ success: false, message: "Token required" });
        }

        const refToken = await RefreshToken.findOne({
            where: { token: refreshToken, type: 'Operator' },
        });

        if (!refToken) {
            return res.status(404).json({ success: false, message: "Invalid refresh token" });
        }

        if (refToken.expiry_date < Date.now()) {
            await refToken.destroy();
            return res.status(404).json({ success: false, message: "Refresh token has expired" });
        }

        const accessToken = generateAccessToken(refToken.userId, 'Distributor');

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            data: accessToken,
        });

    } catch (error) {
        console.error("Error refreshing access token:", error);
        next(error);
    }

}

module.exports = {
    createRefreshToken,
    manufacturerRefreshTokenHandler,
    distributorRefreshTokenHandler,
    operatorRefreshTokenHandler
}