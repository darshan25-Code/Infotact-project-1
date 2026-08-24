const express = require("express");

const {
    createTelemetry,
    getAllTelemetry,
    getTelemetryBySensor
} = require("../controllers/telemetryController");

const router = express.Router();

router.post("/", createTelemetry);
router.get("/", getAllTelemetry);
router.get("/:sensorId", getTelemetryBySensor);


module.exports = router;