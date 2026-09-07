const Sensor = require("../models/Sensor");

const validateSensorExists = async (req, res, next) => {
    try {
        const sensorId =
            req.body.sensorId ||
            req.params.sensorId;

        if (!sensorId) {
            return res.status(400).json({
                success: false,
                message: "sensorId is required"
            });
        }

        const sensor = await Sensor.findOne({
            sensorId
        });

        if (!sensor) {
            return res.status(404).json({
                success: false,
                message: "Sensor not found"
            });
        }

        req.sensor = sensor;

        next();

    } catch (error) {
        console.error(
            "Sensor validation error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to validate sensor"
        });
    }
};

module.exports = validateSensorExists;