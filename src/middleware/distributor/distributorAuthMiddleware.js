const { Distributor } = require("../../models")
const jwt = require("jsonwebtoken");

const distributorAuthMiddleware = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token required",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        if (decoded.type !== "Distributor") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }
        const distributor = await Distributor.findByPk(decoded.id, {
            attributes: ['id', 'email', 'name']
            // {
            //     exclude: ["password"]
            // },
        });
        if (!distributor) {
            return res.status(404).json({
                success: false,
                message: "Distributor not found",
            });
        }

        req.distributor = distributor;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });

    }

};

module.exports = {
    distributorAuthMiddleware,
};