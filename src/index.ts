import express, { Application } from "express";
import dotenv from 'dotenv'
dotenv.config();
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";
import { errorHandler } from "./middlewares/ErrorHandler";
import authRouter from "./routes/AuthRouter";
import studentRouter from "./routes/StudentRouter";
import cors from 'cors';
import { consoleLogger } from "./middlewares/Logger";
import { fileLogger } from "./middlewares/Logger";
import cookieParser from "cookie-parser";
import teacherRouter from "./routes/TeacherRouter";
import classRouter from "./routes/ClassRoute";
import attendaceRouter from "./routes/AttendanceRouter";
import schoolRouter from "./routes/SchoolRouter";



class App {
  public app: Application;

  constructor() {
    this.app = express();


    this.intitalizeStorage()
    this.initializeMiddleware()
    this.initializeRouter()
  }


  private intitalizeStorage(): void {
    connectDB();
    connectRedis()
  }

  private initializeMiddleware(): void {
    this.app.use(
      cors({
        origin: ["http://localhost:3000", "http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
      })
  );
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(consoleLogger)
    this.app.use(fileLogger)
  }

  private initializeRouter(): void {
    this.app.use("/auth", authRouter)
    this.app.use("/student", studentRouter)
    this.app.use('/teacher', teacherRouter)
    this.app.use('/class', classRouter)
    this.app.use('/attendance', attendaceRouter)
    this.app.use('/school', schoolRouter)
    this.app.use(errorHandler);
  }


  public listen(): void {
    this.app.listen(process.env.PORT, () => {
      console.log(
        `🔥 Authentication service listening to port ${process.env.PORT}`
      );
    });
  }
}



const app = new App();
app.listen();



