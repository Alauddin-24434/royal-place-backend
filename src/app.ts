import express, { Application, NextFunction, Request,  Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { AppError } from "./app/error/appError";

import { envVariable } from "./app/config";
import { userRoute } from "./app/modules/User/user.route";
import { roomRoute } from "./app/modules/Room/room.route";

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser())

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Database connected",
  });
});

//refresh token route and veryfy and accestoken

app.post("/api/refresh-token", (req: Request, res: Response) => { 
  res.status(200).json({
    success: true,
    message: "Refresh token route",
  });
});



app.use('/api', userRoute);
app.use('/api',roomRoute);

app.use((req: Request, res: Response,next:NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });
});




app.use((err:AppError, req:Request, res:Response, next:NextFunction)=>{
  let statusCode= err.statusCode || 500;
  let message= err.message || "Something went wrong!"



  res.status(statusCode).json({
    success:false,
    statusCode,
    message,
    stack: envVariable.ENV=== "development" ? err.stack : undefined,
    
    
  })

})


export default app;
