// middleware/operator/operatorAuthMiddleware.js

const jwt = require("jsonwebtoken");

const operatorAuthMiddleware = async (req, res, next) => {

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

        if (decoded.type !== "Operator") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access",
            });
        }
        const operator = await Operator.findByPk(decoded.id, {
            attributes: ['id', 'email', 'name']
        });
        if (!operator) {
            return res.status(404).json({
                success: false,
                message: "Operator not found",
            });
        }

        req.operator = operator;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });

    }

};

module.exports = {
    operatorAuthMiddleware,
};