import Admin from '../../models/Admin'
import { BaseRepository } from './BaseRepository';
import { AdminProfileEntityType, AdminProfileUserEntityType } from '../../types/types';
import { IAdminRepository } from '../interface/IAdminRepository';
import mongoose from 'mongoose';

class AdminRepository extends BaseRepository<AdminProfileEntityType> implements IAdminRepository {
    constructor(){
        super(Admin)
    }

    async createAdminProfile(data: AdminProfileEntityType): Promise<AdminProfileEntityType> {
        try{
            return await this.create(data)
        }catch(error){
            console.error("Error creating admin profile", error);
            throw new Error("Error creating admin profile")
        }
    }

    async updateAdminProfile(id: string, data: Partial<AdminProfileEntityType>): Promise<AdminProfileEntityType | null> {
        try{
            return await this.update(id, data)

        }catch(error){
            console.error("Error updating admin profile", error);
            throw new Error("Error updating admin profile")
        }
    }

    async getAdminProfile(query: any): Promise<AdminProfileUserEntityType | null> {
        try{
           const adminProfile = await Admin.aggregate([
            {
                $match: query
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

           return adminProfile[0]

        }catch(error){
            console.error("Error fetching admin profile", error);
            throw new Error("Error fetching admin profile")
        }
    }

}


export default new AdminRepository()