import mongoose from "mongoose";
import { envVariable } from "./config";
import app from "./app";

async function server() {
  try {
    await mongoose.connect(envVariable.DB_URL as string);
    console.log("🛢 Database connected");

    app.listen(envVariable.PORT, () => {
      console.log(`🚀 Hotel booking app listening on port ${envVariable.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
  }
}

server()