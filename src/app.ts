// src/app.ts
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import moragn from "morgan";
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

// ==============================
// App Configuration
// ==============================
const app: Application = express();

// -------------------------------
// Rate limiter middleware
// Protect API from too many requests (DDoS / brute-force)
// -------------------------------
app.use(rateLimiter);

// ---------------------------------
// Helmet middleware
// Adds security headers like CSP, HSTS, XSS protection etc.
// ---------------------------------
app.use(helmet());

// --------------------------------
// Disable X-powered-by-header
// Hide server info for security reason
// ---------------------------------

app.disable("x-powered-by");

// -----------------------------------
//  Morgan
// -----------------------------------

app.use(
  moragn("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

// ---------------------------------
// Cors Setup
// Allows requests from frontend domains with credentials
// ---------------------------------
app.use(
  cors({
    origin: true, // সব origin allow করে
    credentials: true,
    allowedHeaders: "*", // সব headers allow করে
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// ------------------------------
// Body Parsing & Cookie Parsing Middleware
// -------------------------------

// Parse cookies from incoming requests (req.cookies)
app.use(cookieParser());

// Parse incoming JSON payloads and make them available on req.body
app.use(express.json());

// Parse URL-encoded form data (e.g., form submissions)
// 'extended: true' allows rich objects and arrays to be encoded
app.use(express.urlencoded({ extended: true }));


// ---------------------------------
// 5️⃣ Sanitize Middleware — Prevent XSS & NoSQL Injection
// ---------------------------------
app.use(sanitizeMiddleware);


// -------------------------------
// Redis Connect
// -------------------------------
connectRD().catch((err) => console.error("Redis connection failed", err));

// -------------------------------
// Redis Session Store
// -------------------------------
const redisStore = new RedisStore({
  client: redisClient,
});

// ------------------------------
// Express Session Middleware
// ------------------------------
// Store sessions in Redis for scalability

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
//   Root Route
// -----------------------------------
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: `Server running`,
  });
});

// ---------------------------------
// Main Api Routes
// ---------------------------------
mainRoutes(app);

// ---------------------------------
// 404 Not Found Handler
// ---------------------------------
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});

// ---------------------
// Sentry error handler
// ---------------------

// ---------------------------------
// Global Error Handler
// --------------------------------
app.use(globalErrorHandler);

// ------------------------------
// Export App
// ------------------------------
export default app;
