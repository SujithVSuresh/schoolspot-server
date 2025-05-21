import School from '../../models/School'
import { BaseRepository } from './BaseRepository';
import { ISchoolRepository } from '../interface/ISchoolRepository';
import { SchoolProfileEntityType } from '../../types/SchoolProfileType';


class SchoolRepository extends BaseRepository<SchoolProfileEntityType> implements ISchoolRepository {
    constructor(){
        super(School)
    }

    async createSchoolProfile(data: SchoolProfileEntityType): Promise<SchoolProfileEntityType> {
        try{
            return await this.create(data)
        }catch(error){
            console.error("Error creating user", error);
            throw new Error("Error creating user")
        }
    }

        async findSchoolById(id: string): Promise<SchoolProfileEntityType | null>{
            try{
                return await this.findById(id)
            } catch(error){
                console.error("Error updating user", error);
                throw new Error("Error updating user")
            }
        }

        async updateSchoolProfile(id: string, data:SchoolProfileEntityType): Promise<SchoolProfileEntityType | null>{
            try{
                return await this.update(id, data)
            }catch(error){
                console.error("Error updating user", error);
                throw new Error("Error updating user")
            }
        }

}


export default new SchoolRepository()