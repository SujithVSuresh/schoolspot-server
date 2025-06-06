import { Request, Response, NextFunction } from "express";
import { IAuthController } from "../interface/IAuthController";
import { IAuthService } from "../../services/interface/IAuthService";
import HttpStatus from "../../constants/StatusConstants";
import Messages from "../../constants/MessageConstants";
import { CustomRequest } from "../../types/types";
import { ChangePasswordRequestDTO } from "../../dto/AuthDTO";
import { CreateSchoolProfileDTO } from "../../dto/SchoolDTO";
import { CreateUserDTO } from "../../dto/UserDTO";

export class AuthController implements IAuthController {
  constructor(private _authService: IAuthService) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { schoolData, userData } = req.body;

      const schoolDataToCache: CreateSchoolProfileDTO  = {
      schoolName: schoolData.schoolName,
      phoneNumber: schoolData.phoneNumber,
      board: schoolData.board,
      principalName: schoolData.principalName,
      regNumber: schoolData.regNumber,
      totalStudents: schoolData.totalStudents,
      totalTeachers: schoolData.totalTeachers,
      websiteUrl: schoolData.websiteUrl,
      yearEstablished: schoolData.yearEstablished,
      address: {
        city: schoolData.city,
        country: schoolData.country,
        state: schoolData.state,
        postalCode: schoolData.postalCode
      } 
    }

    const userDataToCache: CreateUserDTO = {
      email: userData.email,
      password: userData.password,
      role: "admin",
      authProvider: "email",
      schoolId: "",
      status: "inactive"
    }
      const email = await this._authService.signup(userDataToCache, schoolDataToCache, schoolData.academicYear);
      res.status(HttpStatus.OK).json({ email });
    } catch (err) {
      next(err);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { otp, email } = req.body;
      const {
        accessToken,
        refreshToken,
        _id,
        email: userEmail,
        role,
        status,
        schoolId,
      } = await this._authService.verify(otp, email);

      res.cookie("adminRefreshToken", refreshToken, {
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
        schoolId,
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
      const { email, password, role: userRole } = req.body;
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
      const schoolData = req.body.schoolData;
      const {
        _id,
        email,
        role,
        status,
        accessToken,
        refreshToken,
        authProvider,
      } = await this._authService.googleAuth(credential, clientId, schoolData);

      res.cookie(`${role}RefreshToken`, refreshToken, {
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
        authProvider,
      });
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { role } = req.body;
      if (!req.cookies) {
        res.status(HttpStatus.FORBIDDEN).json({ error: Messages.NO_TOKEN });
        return;
      }

      const refreshToken = req.cookies[`${role}RefreshToken`];

      if (!refreshToken) {
        res.status(HttpStatus.FORBIDDEN).json({ error: Messages.NO_TOKEN });
        return;
      }
      const response = await this._authService.refreshToken(refreshToken);
      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, role, status, schoolId } = req.body;

      const user = await this._authService.createUser({
        email,
        password,
        role,
        status,
        schoolId,
        authProvider: "email"
      });

      res.status(HttpStatus.CREATED).json({
        _id: user._id,
        email: user.email,
        role: user.email,
        status: user.status,
      });
    } catch (err) {
      next(err);
    }
  }

  // async getAllStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try{

  //     const users = await this._authService.getAllStudents()

  //     res.status(HttpStatus.CREATED).json(users);

  //   }catch(err){
  //     next(err)
  //   }
  // }

  async changeAccountStatus(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { status, userId } = req.body;

      const token = req.user?.token

      const response = await this._authService.changeAccountStatus(
        userId,
        status,
      );

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async changePassword(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user?.userId;

      const data: ChangePasswordRequestDTO = {
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
      };

      const response = await this._authService.changePassword(
        userId as string,
        data
      );

      res.status(HttpStatus.OK).json({ email: response });
    } catch (err) {
      next(err);
    }
  }
}
