import Admin from '../../models/Admin'
import { BaseRepository } from './BaseRepository';
import { AdminProfileType, AdminProfileUserEntityType } from '../../types/types';
import { IAdminRepository } from '../interface/IAdminRepository';
import mongoose from 'mongoose';

class AdminRepository extends BaseRepository<AdminProfileType> implements IAdminRepository {
    constructor(){
        super(Admin)
    }

    async createAdminProfile(data: AdminProfileType): Promise<AdminProfileType> {
        try{
            return await this.create(data)
        }catch(error){
            console.error("Error creating admin profile", error);
            throw new Error("Error creating admin profile")
        }
    }

    async getAdminByUserId(id: string): Promise<AdminProfileUserEntityType | null> {
        try{
           const adminProfile = await Admin.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: 'Users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { 
                $unwind: "$user" 
            },
           ])

           console.log(adminProfile, "blaaaa")

           return adminProfile[0]

        }catch(error){
            console.error("Error fetching admin profile", error);
            throw new Error("Error fetching admin profile")
        }
    }

}


export default new AdminRepository()