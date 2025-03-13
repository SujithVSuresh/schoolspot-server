import School from '../../models/School'
import { BaseRepository } from './BaseRepository';
import { SchoolProfileType } from '../../types/types';
import { ISchoolRepository } from '../interface/ISchoolRepository';


class SchoolRepository extends BaseRepository<SchoolProfileType> implements ISchoolRepository {
    constructor(){
        super(School)
    }

    async createSchoolProfile(data: SchoolProfileType): Promise<SchoolProfileType> {
        try{
            return await this.create(data)
        }catch(error){
            console.error("Error creating user", error);
            throw new Error("Error creating user")
        }
    }

        async findSchoolById(id: string): Promise<SchoolProfileType>{
            try{
                return await this.findById(id) as SchoolProfileType
            } catch(error){
                console.error("Error updating user", error);
                throw new Error("Error updating user")
            }
        }

}


export default new SchoolRepository()