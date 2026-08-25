const validateTelemetry = (req, res, next) => {
    const {
        sensorId,
        temperature,
        humidity,
        pressure,
        timestamp
    } = req.body;

    // sensorId validation
    if (!sensorId || typeof sensorId !== "string" || !sensorId.trim()) {
        return res.status(400).json({
            success: false,
            message: "Valid sensorId is required"
        });
    }

    // At least one telemetry value
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

    // Temperature validation
    if (
        temperature !== undefined &&
        (typeof temperature !== "number" || !Number.isFinite(temperature))
    ) {
        return res.status(400).json({
            success: false,
            message: "Temperature must be a valid number"
        });
    }

    // Humidity validation
    if (
        humidity !== undefined &&
        (
            typeof humidity !== "number" ||
            !Number.isFinite(humidity) ||
            humidity < 0 ||
            humidity > 100
        )
    ) {
        return res.status(400).json({
            success: false,
            message: "Humidity must be between 0 and 100"
        });
    }

    // Pressure validation
    if (
        pressure !== undefined &&
        (typeof pressure !== "number" || !Number.isFinite(pressure))
    ) {
        return res.status(400).json({
            success: false,
            message: "Pressure must be a valid number"
        });
    }

    // Timestamp validation
    if (
        timestamp !== undefined &&
        isNaN(new Date(timestamp).getTime())
    ) {
        return res.status(400).json({
            success: false,
            message: "Timestamp must be a valid date"
        });
    }

    next();
};

module.exports = validateTelemetry;