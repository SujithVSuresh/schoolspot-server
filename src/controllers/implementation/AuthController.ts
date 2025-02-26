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
  
  }
  