import { CreateSchoolProfileDTO, SchoolProfileResponseDTO } from "../../dto/SchoolDTO"

export interface ISchoolService{
    getSchool(schoolId: string): Promise<SchoolProfileResponseDTO>
    createSchool(data: CreateSchoolProfileDTO): Promise<SchoolProfileResponseDTO>
    editSchoolProfile(id: string, data: CreateSchoolProfileDTO): Promise<SchoolProfileResponseDTO>
}