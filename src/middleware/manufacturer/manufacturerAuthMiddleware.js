const { Manufacturer } = require("../../models")
const jwt = require("jsonwebtoken");

const manufacturerAuthMiddleware = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token required",
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (decoded.type !== "Manufacturer") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access",
            });
        }

        const manufacturer = await Manufacturer.findByPk(decoded.id, {
            attributes: ['id', 'email', 'name']
        });

        if (!manufacturer) {
            return res.status(404).json({
                success: false,
                message: "Manufacturer not found",
            });
        }

        req.manufacturer = manufacturer;

        next();

    } catch (error) {

        return res.status(401).json({ success: false, message: "Invalid or expired token", });

    }
};

module.exports = { manufacturerAuthMiddleware };