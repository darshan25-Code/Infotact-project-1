const express = require("express");

const {
    registerSensor
} = require("../controllers/sensorController");

const router = express.Router();

router.post("/", registerSensor);

module.exports = router;