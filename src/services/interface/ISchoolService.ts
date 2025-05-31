import { CreateSchoolProfileDTO, SchoolProfileResponseDTO } from "../../dto/SchoolDTO"

export interface ISchoolService{
    getSchool(schoolId: string): Promise<SchoolProfileResponseDTO>
    createSchool(data: CreateSchoolProfileDTO): Promise<SchoolProfileResponseDTO>
    editSchoolProfile(id: string, data: CreateSchoolProfileDTO): Promise<SchoolProfileResponseDTO>
    getSchoolOverview(schoolId: string): Promise<{studentCount: number; teacherCount: number; classCount: number;}>
    findSchools(): Promise<SchoolProfileResponseDTO[]>
    fetchSchoolProfileDetails(schoolId: string): Promise<any>
}