import { Request, Response, NextFunction } from "express";
import { IAuthController } from "../interface/IAuthController";
import { IAuthService } from "../../services/interface/IAuthService";
import HttpStatus from "../../constants/StatusConstants";
import Messages from "../../constants/MessageConstants";

export class AuthController implements IAuthController {
  constructor(private _authService: IAuthService) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {schoolData, userData} = req.body
      const email = await this._authService.signup(userData, schoolData);
      console.log(email, "this is the email...")
      res.status(HttpStatus.OK).json({ email });
    } catch (err) {
      next(err);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { otp, email } = req.body;
      const {accessToken, refreshToken, _id, email: userEmail, role, status} = await this._authService.verify(otp, email);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.status(HttpStatus.CREATED).json({
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
      const { email, password, role:userRole } = req.body;
      const {
        _id,
        email: userEmail,
        role,
        status,
        accessToken,
        refreshToken,
      } = await this._authService.signin(email, password, userRole);

      res.cookie(`${role}RefreshToken`, refreshToken, {
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
      const { credential, clientId } = req.body.payload;
      const schoolData = req.body.schoolData
      const { _id, email, role, status, accessToken, refreshToken } =
        await this._authService.googleAuth(credential, clientId, schoolData);

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

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if(!req.cookies) {
        res.status(HttpStatus.FORBIDDEN).json({error: Messages.NO_TOKEN})
        return;
      }

      const refreshToken = req.cookies.refreshToken;

      if(!refreshToken) {
        res.status(HttpStatus.FORBIDDEN).json({error: Messages.NO_TOKEN})
        return;
      }
      const response = await this._authService.refreshToken(refreshToken)
      res.status(HttpStatus.OK).json(response)
    } catch (err) {
      next(err)
    }
  }


  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const {email, password, role, status} = req.body

      const user = await this._authService.createUser({email, password, role, status})

      console.log("hey this is the new user", user)

      res.status(HttpStatus.CREATED).json({
        _id: user._id,
        email: user.email,
        role: user.email,
        status: user.status,
      });

    }catch(err){
      next(err)
    }
  }

  async getAllStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{

      const users = await this._authService.getAllStudents()

      res.status(HttpStatus.CREATED).json(users);

    }catch(err){
      next(err)
    }
  }

  async changeAccountStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const {status, userId} = req.body

      console.log(userId, "idd")

      const response = await this._authService.changeAccountStatus(userId, status)

      res.status(HttpStatus.OK).json(response);

    }catch(err){
      next(err)
    }
  }
}
