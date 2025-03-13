import { AdminProfileType } from "../../types/types";


export interface IAdminRepository {
    createAdminProfile(data: AdminProfileType): Promise<AdminProfileType>;
}