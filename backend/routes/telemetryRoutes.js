const express = require("express");

const {
    createTelemetry,
    getAllTelemetry,
    getTelemetryBySensor,
    getTelemetryStats,
    getLatestTelemetryBySensor,
    getLatestTelemetryForAllSensors,
    getRecentTelemetry
} = require("../controllers/telemetryController");

const validateTelemetry =
    require("../middleware/telemetryValidation");

const validateSensorExists =
    require("../middleware/sensorValidation");

const router = express.Router();

// Create telemetry
router.post(
    "/",
    validateTelemetry,
    validateSensorExists,
    createTelemetry
);

// Latest telemetry for all sensors
router.get(
    "/latest",
    getLatestTelemetryForAllSensors
);

// Recent telemetry
router.get(
    "/recent",
    getRecentTelemetry
);

// Statistics for sensor
router.get(
    "/:sensorId/stats",
    getTelemetryStats
);

// Latest telemetry for sensor
router.get(
    "/:sensorId/latest",
    getLatestTelemetryBySensor
);

// Telemetry for sensor
router.get(
    "/:sensorId",
    getTelemetryBySensor
);

// All telemetry
router.get(
    "/",
    getAllTelemetry
);

module.exports = router;