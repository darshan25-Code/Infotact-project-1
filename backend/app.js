const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/healthRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check API
app.use("/api/health",healthRoutes)
app.use("/api/telemetry", telemetryRoutes);

module.exports = app;