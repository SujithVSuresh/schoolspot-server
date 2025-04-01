import { AdminProfileUserEntityType } from "../../types/types";
import { AdminProfileEntityType } from "../../types/types";

export interface IAdminRepository {
    createAdminProfile(data: AdminProfileEntityType): Promise<AdminProfileEntityType>
    updateAdminProfile(id: string, data: Partial<AdminProfileEntityType>): Promise<AdminProfileEntityType | null> 
    getAdminByUserId(id: string): Promise<AdminProfileUserEntityType | null>
}