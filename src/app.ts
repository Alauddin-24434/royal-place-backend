import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import globalErrorHandler from "./app/middleware/globalErrorHandeller";
import { initialRoute } from "./app/apiRoutes";
import { envVariable } from "./app/config";
import { authenticateUser } from "./app/middleware/authenticateUser";
import { authorizeRoles } from "./app/middleware/authorizeRoles";

// ==============================
// App Configuration
// ==============================
const app: Application = express();
app.use(cors({

  origin: ["http://localhost:3000", "https://royal-place.vercel.app"],

  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-vercel-protection-bypass'], // যদি প্রয়োজন হয়
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']

}));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//==================================== Root and Utility Routes========================================

app.get("/", (req: Request, res: Response) => {
  console.log(typeof process.env.PORT); // "string"
  console.log(typeof process.env.JWT_ACCESS_TOKEN_SECRET); // "string"
  console.log(typeof process.env.SUCCESS_URL); // "string"
  res.status(200).json({
    success: true,
    message: `Database connected ${envVariable.ENV}`,
  });
});

app.get("/test1", (req, res) => {
  res.json({ message: "Hello world" });
});

app.get("/test2", authenticateUser, (req, res) => {
  res.json({ message: "Authenticated!", user: req.user });
});

app.get("/test3", authenticateUser, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin only" });
});
app.get("/test4",  authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin only" });
});



// =======================Main Api Routes===============================

initialRoute(app)


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
