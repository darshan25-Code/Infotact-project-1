const express = require("express");

const {
    registerSensor,
    getAllSensors,
    getSensorById,
    updateSensorStatus
} = require("../controllers/sensorController");

const router = express.Router();

router.post("/", registerSensor);
router.get("/", getAllSensors);

router.patch("/:sensorId/status", updateSensorStatus);

router.get("/:sensorId", getSensorById);

module.exports = router;