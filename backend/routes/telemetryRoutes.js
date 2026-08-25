const express = require("express");

const {
    createTelemetry,
    getAllTelemetry,
    getTelemetryBySensor,
    getTelemetryStats,
    getLatestTelemetryBySensor,
    getLatestTelemetryForAllSensors
} = require("../controllers/telemetryController");
const validateTelemetry = require("../middleware/telemetryValidation");



const router = express.Router();
router.post("/", validateTelemetry, createTelemetry);

router.get("/", getAllTelemetry);

router.get("/latest", getLatestTelemetryForAllSensors);

router.get("/:sensorId/stats", getTelemetryStats);

router.get("/:sensorId/latest", getLatestTelemetryBySensor);

router.get("/:sensorId", getTelemetryBySensor);

module.exports = router;