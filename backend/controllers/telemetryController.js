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

const getTelemetryBySensor = async (req, res) => {
    try {
        const { sensorId } = req.params;
        const { start, end } = req.query;
        if (start && isNaN(new Date(start).getTime())) {
    return res.status(400).json({
        success: false,
        message: "Invalid start date"
    });
}

if (end && isNaN(new Date(end).getTime())) {
    return res.status(400).json({
        success: false,
        message: "Invalid end date"
    });
}

        const filter = {
            sensorId
        };

        if (start || end) {
            filter.timestamp = {};

            if (start) {
                filter.timestamp.$gte = new Date(start);
            }

            if (end) {
                filter.timestamp.$lte = new Date(end);
            }
        }

        const telemetry = await Telemetry.find(filter)
            .sort({ timestamp: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            sensorId,
            count: telemetry.length,
            data: telemetry
        });
    } catch (error) {
        console.error("Sensor telemetry retrieval error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to retrieve sensor telemetry"
        });
    }
};

const getTelemetryStats = async (req, res) => {
    try {
        const { sensorId } = req.params;

        const stats = await Telemetry.aggregate([
            {
                $match: {
                    sensorId: sensorId
                }
            },
            {
                $group: {
                    _id: "$sensorId",

                    count: {
                        $sum: 1
                    },

                    averageTemperature: {
                        $avg: "$temperature"
                    },

                    minimumTemperature: {
                        $min: "$temperature"
                    },

                    maximumTemperature: {
                        $max: "$temperature"
                    },

                    averageHumidity: {
                        $avg: "$humidity"
                    },

                    minimumHumidity: {
                        $min: "$humidity"
                    },

                    maximumHumidity: {
                        $max: "$humidity"
                    },

                    averagePressure: {
                        $avg: "$pressure"
                    },

                    minimumPressure: {
                        $min: "$pressure"
                    },

                    maximumPressure: {
                        $max: "$pressure"
                    }
                }
            }
        ]);

        if (stats.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No telemetry data found for this sensor"
            });
        }

        const result = stats[0];

        res.status(200).json({
            success: true,
            sensorId: result._id,
            statistics: {
                count: result.count,

                temperature: {
                    average: result.averageTemperature,
                    minimum: result.minimumTemperature,
                    maximum: result.maximumTemperature
                },

                humidity: {
                    average: result.averageHumidity,
                    minimum: result.minimumHumidity,
                    maximum: result.maximumHumidity
                },

                pressure: {
                    average: result.averagePressure,
                    minimum: result.minimumPressure,
                    maximum: result.maximumPressure
                }
            }
        });
    } catch (error) {
        console.error("Telemetry statistics error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to calculate telemetry statistics"
        });
    }
};

module.exports = {
    createTelemetry,
    getAllTelemetry,
    getTelemetryBySensor,
    getTelemetryStats
};