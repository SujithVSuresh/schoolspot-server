import { SchoolProfileType } from "../../types/types";


export interface ISchoolRepository {
    createSchoolProfile(data: SchoolProfileType): Promise<SchoolProfileType>;
    findSchoolById(id: string): Promise<SchoolProfileType | null>
}