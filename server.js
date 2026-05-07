require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const hpp = require("hpp");
const manufacturerRoutes = require("./src/routes/Manufacturer/index");
const distributorRoutes = require("./src/routes/Distributor/index");
const operatorRoutes = require("./src/routes/Operator/index");
const swaggerUi = require('swagger-ui-express');
require('./src/MQTT/mqttHandle')
const db = require("./src/models");
const { manufacturerSwaggerSpec, distributorSwaggerSpec, operatorSwaggerSpec } = require("./src/helpers/swagger");

const app = express();

const PORT = process.env.PORT || 5000;

//   Security Middlewares
// Secure HTTP headers
app.use(helmet());

// Prevent HTTP Parameter Pollution
app.use(hpp());


const corsList = [
    'http://localhost:5001',
    'http://localhost:5000',
    'http://localhost:5173'
];

// Enable CORS
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || corsList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// Compress response
app.use(compression());



//   Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//  Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Swagger route
app.use("/api-docs/manufacturer", swaggerUi.serveFiles(manufacturerSwaggerSpec), swaggerUi.setup(manufacturerSwaggerSpec));
app.use("/api-docs/distributor", swaggerUi.serveFiles(distributorSwaggerSpec), swaggerUi.setup(distributorSwaggerSpec));
app.use("/api-docs/operator", swaggerUi.serveFiles(operatorSwaggerSpec), swaggerUi.setup(operatorSwaggerSpec));

// Health Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true, message: "Server Working",
    });
});


// API Routes
app.use("/v1/manufacturer", manufacturerRoutes);
app.use("/v1/distributor", distributorRoutes);
app.use("/v1/operator", operatorRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);
    return res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});


// Database Connection
const startServer = async () => {
    try {
        await db.sequelize.authenticate();
        console.log("✅ Database connected");

        app.listen(PORT, () => {
            console.log(
                `✅ Server running on port http://localhost:${PORT} in ${process.env.NODE_ENV} mode`
            );
        });
    } catch (error) {
        console.error("❌ Database connection failed:", error.message);
        process.exit(1);
    }
};

startServer();


//   Unhandled Rejection
process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION! 💥", err);
    process.exit(1);
});

//  Uncaught Exception


process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION! 💥", err);
    process.exit(1);
});