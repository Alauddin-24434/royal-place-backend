import mongoose from "mongoose";
import { envVariable } from "./app/config";
import app from "./app";
import { logger } from "./app/utils/logger";

async function server() {
  try {
    await mongoose.connect(envVariable.DB_URL as string);

    logger.info("🛢 Database connected");
   

    app.listen(envVariable.PORT, () => {
      logger.info(`🚀 Hotel booking app listening on port ${envVariable.PORT}`);
    });
  } catch (error) {
    logger.error("❌ Failed to connect to database", error);
    process.exit(1);
  }
}

server();
