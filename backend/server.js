// backend/server.js
require("dotenv").config();
const app = require("./app");
const { dashMatrixSequelize, sequelizeWebsite } = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // ✅ Connect to SDB
    await dashMatrixSequelize.authenticate();
    console.log("✅ Connected to Database successfully.");

    // ✅ Connect to Website DB
    // await sequelizeWebsite.authenticate();
    // console.log("✅ Connected to Website Database successfully.");

    // 🚀 Start Express server - Bind to 0.0.0.0 to accept network connections
    const HOST = process.env.HOST || "0.0.0.0";
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
      console.log(`🌐 Accessible from network at http://<your-ip>:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Unable to start server due to DB error:", error);
    process.exit(1);
  }
};

startServer();
