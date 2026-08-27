const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/healthRoutes");
const telemetryRoutes = require("./routes/telemetryRoutes");
const sensorRoutes = require("./routes/sensorRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check API
app.use("/api/health",healthRoutes)
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/sensors", sensorRoutes);

module.exports = app;