import { AcademicYearResponseDTO, CreateAcademicYearDTO } from "../../dto/AcademicYearDTO";


export interface IAcademicYearService {
    createAcademicYear(data: CreateAcademicYearDTO): Promise<AcademicYearResponseDTO>
    findAcademicYearsBySchool(schoolId: string): Promise<AcademicYearResponseDTO[]>
    updateAcademicYearStatus(id: string, schoolId: string): Promise<AcademicYearResponseDTO>
}