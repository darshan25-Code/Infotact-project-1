const mongoose = require("mongoose");

const telemetrySchema = new mongoose.Schema(
    {
        sensorId: {
            type: String,
            required: true,
            index: true
        },

        temperature: {
            type: Number
        },

        humidity: {
            type: Number
        },

        pressure: {
            type: Number
        },

        timestamp: {
            type: Date,
            required: true,
            default: Date.now
        },

        metadata: {
            type: Object,
            default: {}
        }
    },
    {
        versionKey: false
    }
);

const Telemetry = mongoose.model("Telemetry", telemetrySchema);

module.exports = Telemetry;