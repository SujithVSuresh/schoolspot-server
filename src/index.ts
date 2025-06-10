// Import necessary packages and modules
import express from "express";
import http from 'http';
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env

// Database and cache connections
import connectDB from "./config/db";
import { connectRedis } from "./config/redis";

// Middlewares
import { errorHandler } from "./middlewares/ErrorHandler";
import { consoleLogger } from "./middlewares/Logger";
import { fileLogger } from "./middlewares/Logger";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routers (handling different routes of the app)
import authRouter from "./routes/AuthRouter";
import studentRouter from "./routes/StudentRouter";
import teacherRouter from "./routes/TeacherRouter";
import classRouter from "./routes/ClassRoute";
import attendaceRouter from "./routes/AttendanceRouter";
import schoolRouter from "./routes/SchoolRouter";
import adminRouter from "./routes/AdminRouter";
import assignmentRouter from "./routes/AssignmentRouter";
import subjectRouter from "./routes/SubjectRouter";
import invoiceRouter from "./routes/InvoiceRouter";
import invoiceWebhookRouter from "./routes/invoiceWebhookRouter";
import paymentRouter from "./routes/PaymentRouter";
import chatRouter from "./routes/ChatRouter";
import notificationRouter from "./routes/NotificationRouter";
import examRouter from "./routes/ExamRouter";
import timetableRouter from "./routes/TimeTableRouter";
import examResultRouter from "./routes/ExamResultRouter";
import subscriptionRouter from "./routes/SubscriptionRouter";
import subscriptionWebhookRouter from "./routes/subscriptionWebhookRouter";
import academicYearRouter from "./routes/AcademicYear";
import planRouter from "./routes/PlanRouter";
import chapterRouter from "./routes/ChapterRouter";
import studentAcademicProfileRouter from "./routes/StudentAcademicProfileRouter";

// Socket.io manager
import { SocketManager } from "./socket/socket";

import { setSocketManager } from "./utils/socketSingleton";

// Main application class
class App {
  public app;
  public server;

  constructor() {
    this.app = express(); // Initialize Express app
    this.server = http.createServer(this.app); // Create HTTP server with Express app

    this.initializeSocket();        // Set up Socket.io for real-time communication
    this.intitalizeStorage();       // Connect to MongoDB and Redis
    this.initializeWebhookRouter(); // Set up webhook-specific routes
    this.initializeMiddleware();    // Set up middleware (CORS, loggers, parsers)
    this.initializeRouter();        // Set up main API routes
  }

  // Initialize DB and Redis connections
  private intitalizeStorage(): void {
    connectDB();
    connectRedis();
  }

  // Configure and initialize WebSocket (Socket.IO)
  private initializeSocket(): void {
    const io = new Server(this.server, {
      cors: {
        origin: 'http://localhost:5173', // Allow frontend origin
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
      }
    });

    const socketManager = new SocketManager(io);
    socketManager.initialize(); // Set up all socket event listeners

    setSocketManager(socketManager); 

  }

  // Middleware configuration
  private initializeMiddleware(): void {
    this.app.use(
      cors({
        origin: ["http://localhost:3000", "http://localhost:5173"], // Allow multiple frontends
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
      })
    );
    this.app.use(cookieParser());               // Parse cookies
    this.app.use(express.json());               // Parse JSON request bodies
    this.app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
    this.app.use(consoleLogger);                // Log to console
    this.app.use(fileLogger);                   // Log to file
  }

  // All primary route endpoints
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
    this.app.use("/notification", notificationRouter);
    this.app.use("/exam", examRouter);
    this.app.use("/examResult", examResultRouter);
    this.app.use("/timetable", timetableRouter);
    this.app.use("/subscription", subscriptionRouter);
    this.app.use("/academicYear", academicYearRouter);
    this.app.use("/plan", planRouter);
    this.app.use("/chapter", chapterRouter);
    this.app.use("/academicProfile", studentAcademicProfileRouter);

    // Centralized error handling middleware
    this.app.use(errorHandler);
  }

  // Webhook-specific routes (e.g., Stripe webhooks)
  private initializeWebhookRouter(): void {
    this.app.use("/invoice", invoiceWebhookRouter);
    this.app.use("/subscription", subscriptionWebhookRouter);
  }

  // Start the HTTP server
  public listen(): void {
    this.server.listen(process.env.PORT, () => {
      console.log(
        `🔥 Authentication service listening to port ${process.env.PORT}`
      );
    });
  }
}

// Instantiate and start the app
const app = new App();
app.listen();
