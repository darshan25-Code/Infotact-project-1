const Telemetry = require("../models/Telemetry");

const createTelemetry = async (req, res) => {
    try {
        const {
            sensorId,
            temperature,
            humidity,
            pressure,
            timestamp,
            metadata
        } = req.body;

        if (!sensorId) {
            return res.status(400).json({
                success: false,
                message: "sensorId is required"
            });
        }

        if (
            temperature === undefined &&
            humidity === undefined &&
            pressure === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "At least one telemetry value is required"
            });
        }

        const telemetry = await Telemetry.create({
            sensorId,
            temperature,
            humidity,
            pressure,
            timestamp,
            metadata
        });

        res.status(201).json({
            success: true,
            message: "Telemetry data stored successfully",
            data: telemetry
        });
    } catch (error) {
        console.error("Telemetry ingestion error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to store telemetry data"
        });
    }
};

const getAllTelemetry = async (req, res) => {
    try {
        const telemetry = await Telemetry.find()
            .sort({ timestamp: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: telemetry.length,
            data: telemetry
        });
    } catch (error) {
        console.error("Telemetry retrieval error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve telemetry data"
        });
    }
};

module.exports = {
    createTelemetry,
    getAllTelemetry
};