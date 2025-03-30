import { AdminProfileType } from "../../types/types";
import { AdminProfileUserEntityType } from "../../types/types";


export interface IAdminRepository {
    createAdminProfile(data: AdminProfileType): Promise<AdminProfileType>
    getAdminByUserId(id: string): Promise<AdminProfileUserEntityType | null>
}