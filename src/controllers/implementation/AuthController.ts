import { Request, Response, NextFunction } from "express";
import { IAuthController } from "../interface/IAuthController";
import { IAuthService } from "../../services/interface/IAuthService";
import HttpStatus from "../../constants/StatusConstants";

export class AuthController implements IAuthController {
  constructor(private _authService: IAuthService) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email = await this._authService.signup(req.body);
      res.status(HttpStatus.OK).json({ email });
    } catch (err) {
      next(err);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { otp, email } = req.body;
      const verifiedUser = await this._authService.verify(otp, email);
      res.status(HttpStatus.CREATED).json(verifiedUser);
    } catch (err) {
      next(err);
    }
  }

  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      const userEmail = await this._authService.resendOtp(email);
      res.status(HttpStatus.OK).json({ email: userEmail });
    } catch (err) {
      next(err);
    }
  }

  async signin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const {
        _id,
        email: userEmail,
        role,
        status,
        accessToken,
        refreshToken,
      } = await this._authService.signin(email, password);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(HttpStatus.OK).json({
        _id,
        email: userEmail,
        role,
        status,
        accessToken,
      });
    } catch (err) {
      next(err);
    }
  }

  async passwordResetRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;
      const resetEmail = await this._authService.passwordResetRequest(email);
      res.status(HttpStatus.OK).json({
        email: resetEmail,
      });
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token, password } = req.body;
      const resetEmail = await this._authService.passwordReset(token, password);
      res.status(HttpStatus.OK).json({
        email: resetEmail,
      });
    } catch (err) {
      next(err);
    }
  }

  async googleAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { credential, clientId } = req.body;
      console.log(credential, clientId, "dadada");
      const { _id, email, role, status, accessToken, refreshToken } =
        await this._authService.googleAuth(credential, clientId);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(HttpStatus.OK).json({
        _id,
        email,
        role,
        status,
        accessToken,
      });
    } catch (err) {
      next(err);
    }
  }
}
