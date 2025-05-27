import {
  CreateSchoolProfileDTO,
  SchoolProfileResponseDTO,
} from "../../dto/SchoolDTO";
import { ISchoolRepository } from "../../repositories/interface/ISchoolRepository";
import { ISchoolService } from "../interface/ISchoolService";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { CustomError } from "../../utils/CustomError";
import { ITeacherRepository } from "../../repositories/interface/ITeacherRepository";
import { IStudentRepository } from "../../repositories/interface/IStudentRepository";
import { IClassRepository } from "../../repositories/interface/IClassRepository";

export class SchoolService implements ISchoolService {
  constructor(
    private _schoolRepository: ISchoolRepository,
    private _teacherRepository: ITeacherRepository,
    private _studentRepository: IStudentRepository,
    private _classRepository: IClassRepository
  ) {}
  async getSchool(schoolId: string): Promise<SchoolProfileResponseDTO> {
    const school = await this._schoolRepository.findSchoolById(schoolId);

    if (!school) {
      throw new CustomError(Messages.SCHOOL_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      _id: String(school._id),
      schoolName: school.schoolName,
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
        postalCode: school.address.postalCode,
      },
    };
  }

  async createSchool(
    data: CreateSchoolProfileDTO
  ): Promise<SchoolProfileResponseDTO> {
    const school = await this._schoolRepository.createSchoolProfile(data);

    return {
      _id: String(school._id),
      schoolName: school.schoolName,
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
        postalCode: school.address.postalCode,
      },
    };
  }

  async editSchoolProfile(
    id: string,
    data: CreateSchoolProfileDTO
  ): Promise<SchoolProfileResponseDTO> {
    const school = await this._schoolRepository.updateSchoolProfile(id, data);

    if (!school) {
      throw new CustomError(Messages.SCHOOL_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      _id: String(school._id),
      schoolName: school.schoolName,
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
        postalCode: school.address.postalCode,
      },
    };
  }

  async getSchoolOverview(schoolId: string): Promise<{
    studentCount: number;
    teacherCount: number;
    classCount: number;
  }> {
    const [studentCount, teacherCount, classCount] = await Promise.all([
      this._studentRepository.findStudentsCountBySchool(schoolId),
      this._teacherRepository.getTeacherCountBySchool(schoolId),
      this._classRepository.findClassCountBySchoolId(schoolId),
    ]);

      return {
    studentCount,
    teacherCount,
    classCount,
  };
  }
}
