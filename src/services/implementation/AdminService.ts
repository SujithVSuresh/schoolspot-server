import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { AdminProfileResponseDTO } from "../../dto/AdminDTO";
import { IAdminRepository } from "../../repositories/interface/IAdminRepository";
import { CustomError } from "../../utils/CustomError";
import { IAdminService } from "../interface/IAdminService";

export class AdminService implements IAdminService {
  constructor(
    private _adminRepository: IAdminRepository,
  ) {}

  async getAdminProfile(id: string): Promise<AdminProfileResponseDTO> {
    console.log("this is the get admmm")
      const adminProfile = await this._adminRepository.getAdminByUserId(id)
      

      if(!adminProfile){
        throw new CustomError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND)
      }

      return {
        _id: String(adminProfile._id),
        fullName: adminProfile.fullName ? adminProfile.fullName : "",
        phoneNumber: adminProfile.phoneNumber ? adminProfile.phoneNumber : "",
        role: adminProfile.role ? adminProfile.role : "other",
        user: {
            _id: String(adminProfile.user._id),
            email: adminProfile.user.email,
            role: adminProfile.user.role,
            status: adminProfile.user.status
        }
      }


  }
}