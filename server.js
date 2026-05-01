require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const hpp = require("hpp");

const db = require("./src/models");

const app = express();

const PORT = process.env.PORT || 5000;

//   Security Middlewares
// Secure HTTP headers
app.use(helmet());

// Prevent HTTP Parameter Pollution
app.use(hpp());


// Enable CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        credentials: true,
    })
);

// Compress response
app.use(compression());



//   Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//  Logging
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}


// Health Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true, message: "Server Working",
    });
});


// API Routes
// app.use("/v1/auth", require("./src/routes/authRoutes"));



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