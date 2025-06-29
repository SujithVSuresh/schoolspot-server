import { profile } from "console";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import {
  AdminProfileResponseDTO,
  AdminResponseDTO,
  CreateAdminProfileDTO,
  UpdateAdminProfileDTO,
} from "../../dto/AdminDTO";
import { IAdminRepository } from "../../repositories/interface/IAdminRepository";
import { CustomError } from "../../utils/CustomError";
import { IAdminService } from "../interface/IAdminService";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import mongoose from "mongoose";

export class AdminService implements IAdminService {
  constructor(
    private _adminRepository: IAdminRepository,
    private _userRepository: IUserRepository
  ) {}

  async getAdminProfile(id: string): Promise<AdminProfileResponseDTO> {
    const adminProfile = await this._adminRepository.getAdminProfile({
      userId: new mongoose.Types.ObjectId(id)
    });

    if (!adminProfile) {
      throw new CustomError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      _id: String(adminProfile._id),
      fullName: adminProfile.fullName ? adminProfile.fullName : "",
      phoneNumber: adminProfile.phoneNumber ? adminProfile.phoneNumber : "",
      // role: adminProfile.role ? adminProfile.role : "other",
      user: {
        _id: String(adminProfile.user._id),
        email: adminProfile.user.email,
        role: adminProfile.user.role,
        status: adminProfile.user.status,
      },
    };
  }

  async createAdminProfile(
    data: CreateAdminProfileDTO
  ): Promise<AdminResponseDTO> {
    const profileExist = await this._adminRepository.getAdminProfile(
      {userId: new mongoose.Types.ObjectId(data.userId)}
    );

    if (profileExist) {
      throw new CustomError(
        Messages.PROFILE_ALREADY_EXIST,
        HttpStatus.CONFLICT
      );
    }
    const createAdmin = await this._adminRepository.createAdminProfile(data);

    if (createAdmin) {
      await this._userRepository.updateUser(String(createAdmin.userId), {
        status: "active",
      });
    }

    return {
      _id: String(createAdmin._id),
      fullName: createAdmin.fullName,
      phoneNumber: createAdmin.phoneNumber,
      userId: String(createAdmin.userId),
      schoolId: String(createAdmin.schoolId),
    };
  }

  async updateAdminProfile(id: string, data: UpdateAdminProfileDTO): Promise<AdminResponseDTO> {
    const updateProfile = await this._adminRepository.updateAdminProfile(id, data)

    if(!updateProfile){
      throw new CustomError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return {
      _id: String(updateProfile._id),
      fullName: updateProfile.fullName,
      phoneNumber: updateProfile.phoneNumber,
      userId: String(updateProfile.userId),
      schoolId: String(updateProfile.schoolId),
    }
  }
}
