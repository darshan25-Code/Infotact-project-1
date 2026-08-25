const express = require("express");

const {
    createTelemetry,
    getAllTelemetry,
    getTelemetryBySensor,
    getTelemetryStats
} = require("../controllers/telemetryController");

const router = express.Router();

router.post("/", createTelemetry);
router.get("/", getAllTelemetry);
router.get("/:sensorId/stats", getTelemetryStats);
router.get("/:sensorId", getTelemetryBySensor);


module.exports = router;