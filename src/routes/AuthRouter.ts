import { Router } from "express";
import UserRepository from "../repositories/implementaion/UserRepository";
import SchoolRepository from "../repositories/implementaion/SchoolRepository";
import { AuthService } from "../services/implementation/AuthService";
import { AuthController } from "../controllers/implementation/AuthController";
import { protectRoute } from "../middlewares/AuthHandler";
import { SubscriptionService } from "../services/implementation/SubscriptionService";
import SubscriptionRepository from "../repositories/implementaion/SubscriptionRepository";
import PlanRepository from "../repositories/implementaion/PlanRepository";
import PaymentRepository from "../repositories/implementaion/PaymentRepository";
import { SchoolService } from "../services/implementation/SchoolService";
import { AcademicYearService } from "../services/implementation/AcademicYearService";
import AcademicYearRepository from "../repositories/implementaion/AcademicYearRepository";
import TeacherRepository from "../repositories/implementaion/TeacherRepository";
import StudentRepository from "../repositories/implementaion/StudentRepository";
import ClassRepository from "../repositories/implementaion/ClassRepository";
import AdminRepository from "../repositories/implementaion/AdminRepository";

const schoolService = new SchoolService(SchoolRepository, TeacherRepository, StudentRepository, ClassRepository, AdminRepository, SubscriptionRepository);

const subscriptionService = new SubscriptionService(
  PlanRepository,
  SubscriptionRepository,
  PaymentRepository
);

const academicYearService = new AcademicYearService(AcademicYearRepository)


const authService = new AuthService(
  UserRepository,
  SchoolRepository,
  SubscriptionRepository,
  subscriptionService,
  PlanRepository,
  schoolService,
  academicYearService
);

const authController = new AuthController(authService);

const authRouter = Router();

// Use .bind(this) when passing class methods as callbacks to keep this referring to the correct instance.
authRouter.post("/signup", authController.signup.bind(authController));
authRouter.post("/verify", authController.verify.bind(authController));
authRouter.post("/resend-otp", authController.resendOtp.bind(authController));
authRouter.post("/signin", authController.signin.bind(authController));
authRouter.post(
  "/password-reset-request",
  authController.passwordResetRequest.bind(authController)
);
authRouter.post(
  "/password-reset",
  authController.resetPassword.bind(authController)
);
authRouter.post("/google-auth", authController.googleAuth.bind(authController));
authRouter.post(
  "/create-user",
  protectRoute(["admin"]),
  authController.createUser.bind(authController)
);
authRouter.post(
  "/refreshToken",
  authController.refreshToken.bind(authController)
);
authRouter.patch(
  "/change-account-status",
  protectRoute(["admin"]),
  authController.changeAccountStatus.bind(authController)
);
authRouter.patch(
  "/change-password",
  protectRoute(["admin", "teacher", "student"]),
  authController.changePassword.bind(authController)
);

export default authRouter;
