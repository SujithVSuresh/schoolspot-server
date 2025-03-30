import { AdminProfileResponseDTO } from "../../dto/AdminDTO"

export interface IAdminService{
    getAdminProfile(id: string): Promise<AdminProfileResponseDTO>
}