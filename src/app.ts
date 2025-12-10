// src/app.ts
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import morgan from "morgan"; // moragn → fixed
import { redisClient, connectRD } from "./app/config/redis";
import { envVariable } from "./app/config";
import { mainRoutes } from "./app/apiRoutes";
import globalErrorHandler from "./app/middleware/globalErrorHandeller";
import { RedisStore } from "connect-redis";
import helmet from "helmet";
import rateLimiter from "./app/config/rateLimit";
import { cookieOptions } from "./app/config/cookie";
import { logger } from "./app/utils/logger";
import { sanitizeMiddleware } from "./app/middleware/sanitizeMiddleware";
import swaggerUi from "swagger-ui-express";
import {  swaggerDoc} from "./app/config/swagger";
// ==============================
// App Configuration
// ==============================
const app: Application = express();

// -------------------------------
// Rate limiter middleware
// -------------------------------
app.use(rateLimiter);

// ---------------------------------
// Helmet middleware
// Adds security headers like CSP, HSTS, XSS protection etc.
// ---------------------------------
app.use(helmet());

// --------------------------------
// Disable X-powered-by-header
// ---------------------------------
app.disable("x-powered-by");

// -----------------------------------
// Morgan for logging
// -----------------------------------
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// ---------------------------------
// CORS Setup
// ---------------------------------
app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// ------------------------------
// Body Parsing & Cookie Parsing Middleware
// -------------------------------
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------
// Sanitize Middleware — Prevent XSS & NoSQL Injection
// ---------------------------------
app.use(sanitizeMiddleware);

// -------------------------------
// Redis Connect
// -------------------------------
connectRD().catch((err) => console.error("Redis connection failed", err))

// -------------------------------
// Redis Session Store
// -------------------------------
const redisStore = new RedisStore({ client: redisClient });

// ------------------------------
// Express Session Middleware
// ------------------------------
app.use(
  session({
    store: redisStore,
    secret: envVariable.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: cookieOptions,
  })
);

// ----------------------------------
// Root Route
// -----------------------------------

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: `Server running`,
  });
});


// ----------------------------------
// Swagger UI Setup
// ----------------------------------
swaggerDoc(app)

// ---------------------------------
// Main API Routes
// ---------------------------------
mainRoutes(app);

// ---------------------------------
// 404 Not Found Handler (must be after all routes)
// ---------------------------------
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});

// ---------------------------------
// Global Error Handler
// ---------------------------------
app.use(globalErrorHandler);

// ------------------------------
// Export App
// ------------------------------
export default app;
