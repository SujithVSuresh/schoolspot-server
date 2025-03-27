import { SchoolProfileDTO } from "../../dto/SchoolDTO";
import { ISchoolRepository } from "../../repositories/interface/ISchoolRepository";
import { ISchoolService } from "../interface/ISchoolService";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { CustomError } from "../../utils/CustomError";

export class SchoolService implements ISchoolService{
    constructor(
        private _schoolRepository: ISchoolRepository
    ){}
    async getSchool(schoolId: string): Promise<SchoolProfileDTO> {
        const school = await this._schoolRepository.findSchoolById(schoolId)

        if(!school){
            throw new CustomError(Messages.SCHOOL_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: school._id,
            schoolName: school.schoolName,
            email: school.email,
            phoneNumber: school.phoneNumber,
            regNumber: school.regNumber,
            yearEstablished: school.yearEstablished,
            principalName: school.principalName,
            websiteUrl: school.websiteUrl,
            totalStudents: school.totalStudents,
            totalTeachers: school.totalTeachers,
            board: school.board,
            address: {
                city: school.address.city,
                state: school.address.state,
                country: school.address.country,
                postalCode: school.address.postalCode
            }
        }
    }
}