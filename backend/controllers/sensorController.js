const Sensor = require("../models/Sensor");

// ------------------------------------
// Register Sensor
// ------------------------------------

const registerSensor = async (req, res) => {
    try {
        const {
            sensorId,
            name,
            type,
            location
        } = req.body;

        if (!sensorId || !name || !type || !location) {
            return res.status(400).json({
                success: false,
                message: "sensorId, name, type and location are required"
            });
        }

        const existingSensor = await Sensor.findOne({
            sensorId: sensorId.trim()
        });

        if (existingSensor) {
            return res.status(409).json({
                success: false,
                message: "Sensor already registered"
            });
        }

        const sensor = await Sensor.create({
            sensorId: sensorId.trim(),
            name: name.trim(),
            type: type.trim(),
            location: location.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Sensor registered successfully",
            data: sensor
        });

    } catch (error) {
        console.error("Sensor registration error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to register sensor"
        });
    }
};

// ------------------------------------
// Get All Sensors
// ------------------------------------

const getAllSensors = async (req, res) => {
    try {
        const sensors = await Sensor.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: sensors.length,
            data: sensors
        });

    } catch (error) {
        console.error("Get sensors error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve sensors"
        });
    }
};

// ------------------------------------
// Get Sensor By ID
// ------------------------------------

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

        return res.status(200).json({
            success: true,
            data: sensor
        });

    } catch (error) {
        console.error("Get sensor error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve sensor"
        });
    }
};

// ------------------------------------
// Update Sensor Status
// ------------------------------------

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

        return res.status(200).json({
            success: true,
            message: "Sensor status updated successfully",
            data: sensor
        });

    } catch (error) {
        console.error("Sensor status update error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to update sensor status"
        });
    }
};

// ------------------------------------
// Update Sensor Details
// ------------------------------------

const updateSensor = async (req, res) => {
    try {
        const { sensorId } = req.params;

        const allowedFields = [
            "name",
            "type",
            "location"
        ];

        const updateData = {};

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateData[field] =
                    typeof req.body[field] === "string"
                        ? req.body[field].trim()
                        : req.body[field];
            }
        });

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update"
            });
        }

        const sensor = await Sensor.findOneAndUpdate(
            { sensorId },
            updateData,
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

        return res.status(200).json({
            success: true,
            message: "Sensor updated successfully",
            data: sensor
        });

    } catch (error) {
        console.error("Sensor update error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to update sensor"
        });
    }
};

// ------------------------------------
// Delete Sensor
// ------------------------------------

const deleteSensor = async (req, res) => {
    try {
        const { sensorId } = req.params;

        const sensor = await Sensor.findOneAndDelete({
            sensorId
        });

        if (!sensor) {
            return res.status(404).json({
                success: false,
                message: "Sensor not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Sensor deleted successfully",
            data: sensor
        });

    } catch (error) {
        console.error("Sensor deletion error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to delete sensor"
        });
    }
};

// ------------------------------------
// Get Sensor Counts
// ------------------------------------

const getSensorSummary = async (req, res) => {
    try {
        const total = await Sensor.countDocuments();

        const active = await Sensor.countDocuments({
            status: "active"
        });

        const inactive = await Sensor.countDocuments({
            status: "inactive"
        });

        return res.status(200).json({
            success: true,
            data: {
                total,
                active,
                inactive
            }
        });

    } catch (error) {
        console.error("Sensor summary error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve sensor summary"
        });
    }
};

module.exports = {
    registerSensor,
    getAllSensors,
    getSensorById,
    updateSensorStatus,
    updateSensor,
    deleteSensor,
    getSensorSummary
};