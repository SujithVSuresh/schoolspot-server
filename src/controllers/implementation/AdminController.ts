import HttpStatus from "../../constants/StatusConstants";
import { IAdminService } from "../../services/interface/IAdminService";
import { Request, Response, NextFunction } from "express";
import { IAdminController } from "../interface/IAdminController";
import { CustomRequest, PayloadType } from "../../types/types";
import { CreateAdminProfileDTO, UpdateAdminProfileDTO } from "../../dto/AdminDTO";

export class AdminController implements IAdminController {
  constructor(private _adminService: IAdminService) {}

  async getAdminProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try{
    const userId = req.user?.userId

    const adminProfile = await this._adminService.getAdminProfile(userId as string)

    res.status(HttpStatus.OK).json(adminProfile)

    }catch(err){
        next(err)
    }

  }

  async createAdminProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try{
      const {schoolId, userId} = req.user as PayloadType

      const profileData: CreateAdminProfileDTO = {
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        userId: userId,
        schoolId: schoolId
      }
  
      const createProfile = await this._adminService.createAdminProfile(profileData)
  
      res.status(HttpStatus.CREATED).json(createProfile)
  
      }catch(err){
          next(err)
      }
  }

  async updateAdminProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const profileId = req.params.profileId

      const profileData: UpdateAdminProfileDTO = {
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber
      }

      const updateProfile = await this._adminService.updateAdminProfile(profileId, profileData)

      res.status(HttpStatus.OK).json(updateProfile)

    }catch(err){
      next(err)
    }
  }

}