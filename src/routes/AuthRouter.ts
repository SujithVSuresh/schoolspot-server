import { Router } from "express";
import UserRepository from "../repositories/implementaion/UserRepository";
import { AuthService } from "../services/implementation/AuthService";
import { AuthController } from "../controllers/implementation/AuthController";

const authService = new AuthService(UserRepository);

const authController = new AuthController(authService);

const authRouter = Router();

authRouter.get("/test", () => {
  console.log("Testing the admin server router.");
});

// Use .bind(this) when passing class methods as callbacks to keep this referring to the correct instance.
authRouter.post("/signup", authController.signup.bind(authController));
authRouter.post("/verify", authController.verify.bind(authController));
authRouter.post("/resend-otp", authController.resendOtp.bind(authController));


export default authRouter;