require("dotenv").config();

const mongoose = require("mongoose");

const createTelemetryCollection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const db = mongoose.connection.db;

        const collections = await db
            .listCollections({ name: "telemetry" })
            .toArray();

        if (collections.length > 0) {
            console.log("Telemetry collection already exists.");
            return;
        }

        await db.createCollection("telemetry", {
            timeseries: {
                timeField: "timestamp",
                metaField: "sensorId",
                granularity: "seconds"
            }
        });

        console.log("Telemetry time-series collection created successfully.");
    } catch (error) {
        console.error(
            "Failed to create telemetry collection:",
            error.message
        );
    } finally {
        await mongoose.disconnect();
    }
};

createTelemetryCollection();