const express = require("express");
const cors = require("cors");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check API
app.use("/api/health",healthRoutes)

module.exports = app;