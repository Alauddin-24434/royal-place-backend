// src/app.ts
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";

import { redisClient, connectRD } from "./app/config/redis"; // your function name
import { envVariable } from "./app/config";
import { initialRoute } from "./app/apiRoutes";
import globalErrorHandler from "./app/middleware/globalErrorHandeller";
import { RedisStore } from "connect-redis";

// ==============================
// App Configuration
// ==============================
const app: Application = express();

// CORS setup
app.use(cors({
  origin: ["http://localhost:3000", "https://royal-place.vercel.app"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-vercel-protection-bypass'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// Redis Connect
// ==============================
connectRD().catch(err => console.error("Redis connection failed", err));

// ==============================
// Redis Session Store
// ==============================
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "sess:",  // optional
});

// use in session
app.use(session({
  store: redisStore,
  secret: "my-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: envVariable.NODE_ENV === "production" }
}));



//==================================== Root Route ========================================
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: `Server running`,
  });
});

// =======================Main Api Routes===============================
initialRoute(app);

// ==============================404 Not Found Handler=======================================
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});

// ==============================
// Global Error Handler
// ==============================
app.use(globalErrorHandler);

// ==============================
// Export App
// ==============================
export default app;
