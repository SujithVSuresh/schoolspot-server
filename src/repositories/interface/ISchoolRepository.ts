import { SchoolProfileEntityType } from "../../types/SchoolProfileType";


export interface ISchoolRepository {
    createSchoolProfile(data: SchoolProfileEntityType): Promise<SchoolProfileEntityType>;
    findSchoolById(id: string): Promise<SchoolProfileEntityType | null>;
    updateSchoolProfile(id: string, data:SchoolProfileEntityType): Promise<SchoolProfileEntityType | null>;
}