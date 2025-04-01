import { AdminProfileUserEntityType } from "../../types/types";
import { AdminProfileEntityType } from "../../types/types";

export interface IAdminRepository {
    createAdminProfile(data: AdminProfileEntityType): Promise<AdminProfileEntityType>
    getAdminByUserId(id: string): Promise<AdminProfileUserEntityType | null>
}