import AcademicYear from "../../models/AcademicYear";
import { AcademicYearEntityType } from "../../types/AcademicYearType";
import { IAcademicYearRepository } from "../interface/IAcademicYearRepository";
import { BaseRepository } from "./BaseRepository";




class AcademicYearRepository extends BaseRepository<AcademicYearEntityType> implements IAcademicYearRepository {
    constructor(){
        super(AcademicYear)
    }

    async createAcademicYear(data: AcademicYearEntityType): Promise<AcademicYearEntityType> {
        try{
            return await this.create(data)
        }catch(error){
            console.error("Error creating academic year", error);
            throw new Error("Error creating academic year")
        }
    }

    async updateAcademicYear(id: string, data: Partial<AcademicYearEntityType>): Promise<AcademicYearEntityType | null> {
        try{
            return await this.update(id, data)
        }catch(error){
            console.error("Error updating academic year", error);
            throw new Error("Error updating academic year")
        }
    }

    async findAcademicYear(data: Partial<AcademicYearEntityType>): Promise<AcademicYearEntityType | null> {
        try{
            return await this.findOne(data)
        }catch(error){
            console.error("Error finding academic year", error);
            throw new Error("Error finding academic year")
        }
    }


    async findAcademicYearsBySchool(schoolId: string): Promise<AcademicYearEntityType[]>{
        try{
            return await this.findByQuery({schoolId})
        }catch(error){
            console.error("Error finding academic years", error);
            throw new Error("Error finding academic years")
        }
    }
}

export default new AcademicYearRepository()