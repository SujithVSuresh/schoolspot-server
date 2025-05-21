import { AcademicYearEntityType } from "../../types/AcademicYearType";


export interface IAcademicYearRepository {
    createAcademicYear(data: AcademicYearEntityType): Promise<AcademicYearEntityType>
    updateAcademicYear(id: string, data: Partial<AcademicYearEntityType>): Promise<AcademicYearEntityType | null>
    findAcademicYear(data: Partial<AcademicYearEntityType>): Promise<AcademicYearEntityType | null>
    findAcademicYearsBySchool(schoolId: string): Promise<AcademicYearEntityType[]>
}