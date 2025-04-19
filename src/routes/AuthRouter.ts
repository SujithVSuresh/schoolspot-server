import { Router } from "express";
import UserRepository from "../repositories/implementaion/UserRepository";
import SchoolRepository from "../repositories/implementaion/SchoolRepository";
import { AuthService } from "../services/implementation/AuthService";
import { AuthController } from "../controllers/implementation/AuthController";
import { protectRoute } from "../middlewares/AuthHandler";

const authService = new AuthService(UserRepository, SchoolRepository);

const authController = new AuthController(authService);

const authRouter = Router();


// Use .bind(this) when passing class methods as callbacks to keep this referring to the correct instance.
authRouter.post("/signup", authController.signup.bind(authController));
authRouter.post("/verify", authController.verify.bind(authController));
authRouter.post("/resend-otp", authController.resendOtp.bind(authController));
authRouter.post("/signin", authController.signin.bind(authController));
authRouter.post("/password-reset-request", authController.passwordResetRequest.bind(authController))
authRouter.post("/password-reset", authController.resetPassword.bind(authController))
authRouter.post("/google-auth", authController.googleAuth.bind(authController))
authRouter.post("/create-user", protectRoute(["admin"]), authController.createUser.bind(authController))
authRouter.get("/get-students", protectRoute(["admin"]), authController.getAllStudents.bind(authController))
authRouter.post('/refreshToken', authController.refreshToken.bind(authController))
authRouter.patch('/change-account-status', protectRoute(["admin"]), authController.changeAccountStatus.bind(authController))
authRouter.patch('/change-password', protectRoute(["admin", "teacher", "student"]), authController.changePassword.bind(authController))


export default authRouter;