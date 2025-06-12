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
  private PORT: number;

  constructor() {
    this.app = express(); // Initialize Express app
    this.server = http.createServer(this.app); // Create HTTP server with Express app

    this.PORT = Number(process.env.PORT) || 3000;

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
      path: "/socket.io",
      cors: {
        origin: process.env.FRONTEND_URL, // Allow frontend origin
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
        origin: [process.env.FRONTEND_URL || "http://localhost:5173"], // Allow multiple frontends
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
    this.app.get("/api/test", (req, res) => {
        res.status(200).json({ message: "✅ Deployment is successful!" });
    });
    this.app.use("/api/auth", authRouter);
    this.app.use("/api/student", studentRouter);
    this.app.use("/api/teacher", teacherRouter);
    this.app.use("/api/class", classRouter);
    this.app.use("/api/attendance", attendaceRouter);
    this.app.use("/api/school", schoolRouter);
    this.app.use("/api/admin", adminRouter);
    this.app.use("/api/assignment", assignmentRouter);
    this.app.use("/api/subject", subjectRouter);
    this.app.use("/api/invoice", invoiceRouter);
    this.app.use("/api/payment", paymentRouter);
    this.app.use("/api/chat", chatRouter);
    this.app.use("/api/notification", notificationRouter);
    this.app.use("/api/exam", examRouter);
    this.app.use("/api/examResult", examResultRouter);
    this.app.use("/api/timetable", timetableRouter);
    this.app.use("/api/subscription", subscriptionRouter);
    this.app.use("/api/academicYear", academicYearRouter);
    this.app.use("/api/plan", planRouter);
    this.app.use("/api/chapter", chapterRouter);
    this.app.use("/api/academicProfile", studentAcademicProfileRouter);

    // Centralized error handling middleware
    this.app.use(errorHandler);
  }

  // Webhook-specific routes (e.g., Stripe webhooks)
  private initializeWebhookRouter(): void {
    this.app.use("/api/invoice", invoiceWebhookRouter);
    this.app.use("/api/subscription", subscriptionWebhookRouter);
  }

  // Start the HTTP server
public listen(): void {
  this.server.listen(this.PORT, '0.0.0.0', () => {
    console.log(`🔥 Server running on http://0.0.0.0:${process.env.PORT}`);
  });
}
}

// Instantiate and start the app
const app = new App();
app.listen();
