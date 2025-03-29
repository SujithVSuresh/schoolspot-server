import { SchoolProfileDTO } from "../../dto/SchoolDTO"

export interface ISchoolService{
    getSchool(schoolId: string): Promise<SchoolProfileDTO>
    editSchoolProfile(id: string, data: SchoolProfileDTO): Promise<SchoolProfileDTO>
}