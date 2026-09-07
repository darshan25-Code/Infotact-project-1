const express = require("express");

const {
    registerSensor,
    getAllSensors,
    getSensorById,
    updateSensorStatus,
    updateSensor,
    deleteSensor,
    getSensorSummary
} = require("../controllers/sensorController");

const router = express.Router();

// Create sensor
router.post("/", registerSensor);

// Sensor summary
router.get("/summary", getSensorSummary);

// Get all sensors
router.get("/", getAllSensors);

// Update sensor status
router.patch("/:sensorId/status", updateSensorStatus);

// Update sensor details
router.patch("/:sensorId", updateSensor);

// Delete sensor
router.delete("/:sensorId", deleteSensor);

// Get sensor by ID
router.get("/:sensorId", getSensorById);

module.exports = router;