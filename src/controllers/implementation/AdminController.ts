import HttpStatus from "../../constants/StatusConstants";
import { IAdminService } from "../../services/interface/IAdminService";
import { Request, Response, NextFunction } from "express";
import { IAdminController } from "../interface/IAdminController";
import { CustomRequest } from "../../types/types";

export class AdminController implements IAdminController {
  constructor(private _adminService: IAdminService) {}

  async getAdminProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try{
    const userId = req.user?.userId

    console.log(req.user, "brooo123")

    const adminProfile = await this._adminService.getAdminProfile(userId as string)

    res.status(HttpStatus.OK).json(adminProfile)

    }catch(err){
        next(err)
    }

  }

}