const Sensor = require("../models/Sensor");

const registerSensor = async (req, res) => {
    try {
        const { sensorId, name, type, location } = req.body;

        if (!sensorId || !name || !type || !location) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const existingSensor = await Sensor.findOne({ sensorId });

        if (existingSensor) {
            return res.status(409).json({
                success: false,
                message: "Sensor already registered"
            });
        }

        const sensor = await Sensor.create({
            sensorId,
            name,
            type,
            location
        });

        res.status(201).json({
            success: true,
            message: "Sensor registered successfully",
            data: sensor
        });

    } catch (error) {

        console.error("Sensor registration error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to register sensor"
        });
    }
};

module.exports = {
    registerSensor
};