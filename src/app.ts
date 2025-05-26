import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Database connected",
  });
});


app.use((req: Request, res: Response,next:NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });
});

export default app;
