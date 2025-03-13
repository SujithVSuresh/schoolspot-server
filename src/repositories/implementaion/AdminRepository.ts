import Admin from '../../models/Admin'
import { BaseRepository } from './BaseRepository';
import { AdminProfileType } from '../../types/types';
import { IAdminRepository } from '../interface/IAdminRepository';


class AdminRepository extends BaseRepository<AdminProfileType> implements IAdminRepository {
    constructor(){
        super(Admin)
    }

    async createAdminProfile(data: AdminProfileType): Promise<AdminProfileType> {
        try{
            return await this.create(data)
        }catch(error){
            console.error("Error creating user", error);
            throw new Error("Error creating user")
        }
    }

}


export default new AdminRepository()