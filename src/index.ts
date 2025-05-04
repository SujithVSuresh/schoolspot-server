import express, { Application } from "express";
import http from 'http';
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";
import { errorHandler } from "./middlewares/ErrorHandler";
import authRouter from "./routes/AuthRouter";
import studentRouter from "./routes/StudentRouter";
import cors from "cors";
import { consoleLogger } from "./middlewares/Logger";
import { fileLogger } from "./middlewares/Logger";
import cookieParser from "cookie-parser";
import teacherRouter from "./routes/TeacherRouter";
import classRouter from "./routes/ClassRoute";
import attendaceRouter from "./routes/AttendanceRouter";
import schoolRouter from "./routes/SchoolRouter";
import adminRouter from "./routes/AdminRouter";
import assignmentRouter from "./routes/AssignmentRouter";
import subjectRouter from "./routes/SubjectRouter";
import invoiceRouter from "./routes/InvoiceRouter";
import { SocketManager } from "./socket/socket";
import invoiceWebhookRouter from "./routes/invoiceWebhookRouter";
import paymentRouter from "./routes/PaymentRouter";
import chatRouter from "./routes/ChatRouter";

class App {
  public app;
  public server;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app)

    this.initializeSocket()
    this.intitalizeStorage();
    this.initializeWebhookRouter()
    this.initializeMiddleware();
    this.initializeRouter();
  }

  private intitalizeStorage(): void {
    connectDB();
    connectRedis();
  }

  private initializeSocket():void {
    
    const io = new Server(this.server, {
      cors: {
          origin: 'http://localhost:5173', 
          methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
          credentials: true,
      }
    });

  const socketManager = new SocketManager(io)
  socketManager.initialize()
  
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
    this.app.use(consoleLogger);
    this.app.use(fileLogger);
  }

  private initializeRouter(): void {
    this.app.use("/auth", authRouter);
    this.app.use("/student", studentRouter);
    this.app.use("/teacher", teacherRouter);
    this.app.use("/class", classRouter);
    this.app.use("/attendance", attendaceRouter);
    this.app.use("/school", schoolRouter);
    this.app.use("/admin", adminRouter);
    this.app.use("/assignment", assignmentRouter);
    this.app.use("/subject", subjectRouter);
    this.app.use("/invoice", invoiceRouter);
    this.app.use("/payment", paymentRouter);
    this.app.use("/chat", chatRouter);
    this.app.use(errorHandler);
  }

  private initializeWebhookRouter(): void {
    this.app.use("/invoice", invoiceWebhookRouter)
  }

  public listen(): void {
    this.server.listen(process.env.PORT, () => {
      console.log(
        `🔥 Authentication service listening to port ${process.env.PORT}`
      );
    });
  }
}

const app = new App();
app.listen();
