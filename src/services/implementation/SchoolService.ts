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
import { IAdminRepository } from "../../repositories/interface/IAdminRepository";
import mongoose from "mongoose";
import { ISubscriptionRepository } from "../../repositories/interface/ISubscriptionRepository";
import { AdminProfileResponseDTO, AdminResponseDTO } from "../../dto/AdminDTO";

export class SchoolService implements ISchoolService {
  constructor(
    private _schoolRepository: ISchoolRepository,
    private _teacherRepository: ITeacherRepository,
    private _studentRepository: IStudentRepository,
    private _classRepository: IClassRepository,
    private _adminRepository: IAdminRepository,
    private _subscription: ISubscriptionRepository
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


  async findSchools(): Promise<SchoolProfileResponseDTO[]> {
    const response = await this._schoolRepository.findSchools()

    const schools = response.map((school) => {
      return{
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

      }
    })

    return schools
  }


  async fetchSchoolProfileDetails(schoolId: string): Promise<{
    schoolProfile: any,
    schoolAdmin: AdminProfileResponseDTO,
    subscription: any

  }> {
    const schoolProfile = await this._schoolRepository.findSchoolById(schoolId)

    if(!schoolProfile){
      throw new CustomError(Messages.SCHOOL_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    const schoolAdminResponse = await this._adminRepository.getAdminProfile({
      schoolId: new mongoose.Types.ObjectId(schoolId)
    })

    if(!schoolAdminResponse){
      throw new CustomError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    const schoolAdmin: AdminProfileResponseDTO = {
      _id: String(schoolAdminResponse._id),
      fullName: schoolAdminResponse.fullName,
      phoneNumber: schoolAdminResponse.phoneNumber,
      schoolId: String(schoolAdminResponse.schoolId),
      user: {
          _id: String(schoolAdminResponse.user._id),
          email: schoolAdminResponse.user.email,
          role: schoolAdminResponse.user.role,
          status: schoolAdminResponse.user.status
      }
    }

    const subscription = await this._subscription.findSubscription({
      schoolId: schoolId,
      status: "active"
    })

    if(!subscription){
        throw new CustomError(Messages.SUBSCRIPTION_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return {
      schoolProfile,
      schoolAdmin,
      subscription
    }


  }
}
