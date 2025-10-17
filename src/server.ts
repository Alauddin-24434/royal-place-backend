import mongoose from "mongoose";
import http from "http";

import app from "./app";
import { envVariable } from "./app/config";
import { logger } from "./app/utils/logger";
import { initiateSocket } from "./app/socket";

async function server() {
  try {
    // Connect to MongoDB
    await mongoose.connect(envVariable.MONGO_URI as string);
    logger.info("🛢 Database connected");

    // Create HTTP server with Express app
    const httpServer = http.createServer(app);

    // Initialize Socket.IO with the HTTP server
    initiateSocket(httpServer);

    // Start the server
    httpServer.listen(envVariable.PORT, () => {
      logger.info(`🚀 Hotel booking app listening on port ${envVariable.PORT}`);
    });
  } catch (error) {
    logger.error("❌ Failed to connect to database", error);
    process.exit(1);
  }
}

server();
