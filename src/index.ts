import express, { Application } from "express";
import dotenv from 'dotenv'
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";
import { errorHandler } from "./middlewares/ErrorHandler";
import authRouter from "./routes/AuthRouter";
import studentRouter from "./routes/StudentRouter";
import cors from 'cors';

dotenv.config();

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
  }

  private initializeRouter(): void {
    this.app.use("/auth", authRouter)
    this.app.use("/student", studentRouter)
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



