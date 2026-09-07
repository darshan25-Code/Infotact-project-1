const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/healthRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// -------------------------
// Global Middleware
// -------------------------

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// -------------------------
// API Routes
// -------------------------

app.use("/api/health", healthRoutes);
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/dashboard", dashboardRoutes);

// -------------------------
// 404 Handler
// -------------------------

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// -------------------------
// Global Error Handler
// -------------------------

app.use((err, req, res, next) => {
    console.error("Unhandled server error:", err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

module.exports = app;