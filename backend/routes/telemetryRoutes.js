const express = require("express");

const {
    createTelemetry,
    getAllTelemetry
} = require("../controllers/telemetryController");

const router = express.Router();

router.post("/", createTelemetry);
router.get("/", getAllTelemetry);


module.exports = router;