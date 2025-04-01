import { AdminProfileResponseDTO,  } from "../../dto/AdminDTO"
import { CreateAdminProfileDTO, AdminResponseDTO } from "../../dto/AdminDTO"

export interface IAdminService{
    getAdminProfile(id: string): Promise<AdminProfileResponseDTO>
    createAdminProfile(data: CreateAdminProfileDTO): Promise<AdminResponseDTO>
}