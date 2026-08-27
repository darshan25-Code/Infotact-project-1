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

const getAllSensors = async (req, res) => {
    try {
        const sensors = await Sensor.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: sensors.length,
            data: sensors
        });
    } catch (error) {
        console.error("Get sensors error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve sensors"
        });
    }
};

const getSensorById = async (req, res) => {
    try {
        const { sensorId } = req.params;

        const sensor = await Sensor.findOne({ sensorId });

        if (!sensor) {
            return res.status(404).json({
                success: false,
                message: "Sensor not found"
            });
        }

        res.status(200).json({
            success: true,
            data: sensor
        });
    } catch (error) {
        console.error("Get sensor error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve sensor"
        });
    }
};

const updateSensorStatus = async (req, res) => {
    try {
        const { sensorId } = req.params;
        const { status } = req.body;

        if (!["active", "inactive"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be active or inactive"
            });
        }

        const sensor = await Sensor.findOneAndUpdate(
            { sensorId },
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!sensor) {
            return res.status(404).json({
                success: false,
                message: "Sensor not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Sensor status updated successfully",
            data: sensor
        });
    } catch (error) {
        console.error("Sensor status update error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to update sensor status"
        });
    }
};

module.exports = {
    registerSensor,
    getAllSensors,
    getSensorById,
    updateSensorStatus
};