const Sensor = require("../models/Sensor");
const Telemetry = require("../models/Telemetry");

// ------------------------------------
// Dashboard Summary
// ------------------------------------

const getDashboardSummary = async (req, res) => {
    try {
        const [
            totalSensors,
            activeSensors,
            inactiveSensors,
            totalTelemetry
        ] = await Promise.all([
            Sensor.countDocuments(),

            Sensor.countDocuments({
                status: "active"
            }),

            Sensor.countDocuments({
                status: "inactive"
            }),

            Telemetry.countDocuments()
        ]);

        const latestTelemetry = await Telemetry.find()
            .sort({ timestamp: -1 })
            .limit(1)
            .lean();

        const latest = latestTelemetry.length
            ? latestTelemetry[0]
            : null;

        return res.status(200).json({
            success: true,
            data: {
                sensors: {
                    total: totalSensors,
                    active: activeSensors,
                    inactive: inactiveSensors
                },

                telemetry: {
                    total: totalTelemetry
                },

                latestReading: latest
            }
        });

    } catch (error) {
        console.error(
            "Dashboard summary error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve dashboard summary"
        });
    }
};

module.exports = {
    getDashboardSummary
};