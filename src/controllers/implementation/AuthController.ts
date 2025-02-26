import { Request, Response, NextFunction } from "express";
import { IAuthController } from "../interface/IAuthController";
import { IAuthService } from "../../services/interface/IAuthService";
import HttpStatus from "../../constants/StatusConstants";

export class AuthController implements IAuthController {
    constructor(private _adminService: IAuthService) {}
  
    async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const email = await this._adminService.signup(req.body);
        res.status(HttpStatus.OK).json({ email });
      } catch (err) {
        next(err);
      }
    }


    
  async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const {otp, email} = req.body
      const verifiedUser = await this._adminService.verify(otp, email)
      res.status(HttpStatus.CREATED).json(verifiedUser)
    }catch(err){
      next(err)
    }
  }


  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const {email} = req.body
      const userEmail = await this._adminService.resendOtp(email)
      res.status(HttpStatus.OK).json({email: userEmail})
    }catch(err){
      next(err)
    }
  }
  
  }
  