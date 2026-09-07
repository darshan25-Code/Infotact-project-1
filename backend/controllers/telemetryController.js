const Telemetry = require("../models/Telemetry");

// ------------------------------------
// Create Telemetry
// ------------------------------------

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

        const telemetry = await Telemetry.create({
            sensorId: sensorId.trim(),
            temperature,
            humidity,
            pressure,
            timestamp,
            metadata
        });

        return res.status(201).json({
            success: true,
            message: "Telemetry data stored successfully",
            data: telemetry
        });

    } catch (error) {
        console.error(
            "Telemetry ingestion error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to store telemetry data"
        });
    }
};

// ------------------------------------
// Get All Telemetry
// ------------------------------------

const getAllTelemetry = async (req, res) => {
    try {
        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 100, 1),
            500
        );

        const telemetry = await Telemetry.find()
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean();

        return res.status(200).json({
            success: true,
            count: telemetry.length,
            data: telemetry
        });

    } catch (error) {
        console.error(
            "Telemetry retrieval error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve telemetry data"
        });
    }
};

// ------------------------------------
// Get Telemetry By Sensor
// ------------------------------------

const getTelemetryBySensor = async (req, res) => {
    try {
        const { sensorId } = req.params;
        const { start, end } = req.query;

        const filter = {
            sensorId
        };

        // Validate start date
        if (start) {
            const startDate = new Date(start);

            if (isNaN(startDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid start date"
                });
            }

            filter.timestamp = {
                $gte: startDate
            };
        }

        // Validate end date
        if (end) {
            const endDate = new Date(end);

            if (isNaN(endDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid end date"
                });
            }

            filter.timestamp = {
                ...(filter.timestamp || {}),
                $lte: endDate
            };
        }

        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 100, 1),
            500
        );

        const telemetry = await Telemetry.find(filter)
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean();

        return res.status(200).json({
            success: true,
            sensorId,
            count: telemetry.length,
            data: telemetry
        });

    } catch (error) {
        console.error(
            "Sensor telemetry retrieval error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve sensor telemetry"
        });
    }
};

// ------------------------------------
// Get Telemetry Statistics
// ------------------------------------

const getTelemetryStats = async (req, res) => {
    try {
        const { sensorId } = req.params;

        const stats = await Telemetry.aggregate([
            {
                $match: {
                    sensorId
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

        return res.status(200).json({
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
        console.error(
            "Telemetry statistics error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to calculate telemetry statistics"
        });
    }
};

// ------------------------------------
// Latest Telemetry By Sensor
// ------------------------------------

const getLatestTelemetryBySensor = async (req, res) => {
    try {
        const { sensorId } = req.params;

        const telemetry = await Telemetry.findOne({
            sensorId
        })
            .sort({ timestamp: -1 })
            .lean();

        if (!telemetry) {
            return res.status(404).json({
                success: false,
                message: "No telemetry data found for this sensor"
            });
        }

        return res.status(200).json({
            success: true,
            data: telemetry
        });

    } catch (error) {
        console.error(
            "Latest sensor telemetry error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve latest sensor telemetry"
        });
    }
};

// ------------------------------------
// Latest Telemetry For All Sensors
// ------------------------------------

const getLatestTelemetryForAllSensors = async (req, res) => {
    try {
        const telemetry = await Telemetry.aggregate([
            {
                $sort: {
                    timestamp: -1
                }
            },
            {
                $group: {
                    _id: "$sensorId",

                    latestReading: {
                        $first: "$$ROOT"
                    }
                }
            },
            {
                $replaceRoot: {
                    newRoot: "$latestReading"
                }
            },
            {
                $sort: {
                    timestamp: -1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            count: telemetry.length,
            data: telemetry
        });

    } catch (error) {
        console.error(
            "Latest telemetry retrieval error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve latest telemetry"
        });
    }
};

// ------------------------------------
// Recent Telemetry
// ------------------------------------

const getRecentTelemetry = async (req, res) => {
    try {
        const limit = Math.min(
            Math.max(parseInt(req.query.limit) || 20, 1),
            100
        );

        const telemetry = await Telemetry.find()
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean();

        return res.status(200).json({
            success: true,
            count: telemetry.length,
            data: telemetry
        });

    } catch (error) {
        console.error(
            "Recent telemetry error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve recent telemetry"
        });
    }
};

module.exports = {
    createTelemetry,
    getAllTelemetry,
    getTelemetryBySensor,
    getTelemetryStats,
    getLatestTelemetryBySensor,
    getLatestTelemetryForAllSensors,
    getRecentTelemetry
};