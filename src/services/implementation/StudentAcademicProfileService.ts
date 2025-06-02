import HttpStatus from "../../constants/StatusConstants";
import {
  CreateStudentAcademicProfileDTO,
  StudentAcademicProfileResponseDTO,
  StudentProfileResponseDTO,
} from "../../dto/StudentDTO";
import { IStudentAcademicProfileRepository } from "../../repositories/interface/IStudentAcademicProfileRepository";
import { IStudentRepository } from "../../repositories/interface/IStudentRepository";
import { CustomError } from "../../utils/CustomError";
import { IStudentAcademicProfileService } from "../interface/IStudentAcademicProfileService";
import Messages from "../../constants/MessageConstants";
import mongoose from "mongoose";
import { StudentEntityType } from "../../types/StudentType";
import { UserEntityType } from "../../types/UserType";
import { ClassEntityType } from "../../types/types";

export class StudentAcadmicProfileService
  implements IStudentAcademicProfileService
{
  constructor(
    private _studentAcademicProfileRepository: IStudentAcademicProfileRepository,
    private _studentRepository: IStudentRepository
  ) {}

  async createAcademicProfile(
    data: CreateStudentAcademicProfileDTO,
    admissionNo: string
  ): Promise<StudentAcademicProfileResponseDTO> {
    const studentProfile = await this._studentRepository.getStudent(
      admissionNo
    );

    if (!studentProfile) {
      throw new CustomError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const academicProfile =
      await this._studentAcademicProfileRepository.createAcademicProfile({
        userId: studentProfile.userId as string,
        studentId: studentProfile._id as string,
        academicYear: data.academicYear,
        roll: data.roll,
        classId: data.classId,
      });

    return {
      _id: String(academicProfile._id),
      userId: String(academicProfile.userId),
      studentId: String(academicProfile.studentId),
      roll: academicProfile.roll,
      academicYear: String(academicProfile.academicYear),
      classId: String(academicProfile.classId),
    };
  }

  async fetchStudentProfileByUserId(
    userId: string
  ): Promise<StudentProfileResponseDTO> {
    const studentAcademicProfile =
      await this._studentAcademicProfileRepository.findAcademicProfile({
        userId: new mongoose.Types.ObjectId(userId),
      });

    if (!studentAcademicProfile) {
      throw new CustomError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const student = studentAcademicProfile.studentId as StudentEntityType;
    const user = studentAcademicProfile.userId as UserEntityType;
    const studentClass = studentAcademicProfile.classId as ClassEntityType;

    return {
      _id: String(studentAcademicProfile._id),
      studentId: {
        _id: String(student._id),
        fullName: student.fullName,
        profilePhoto: student.profilePhoto,
        admissionNo: student.admissionNo,
        fatherName: student.fatherName,
        motherName: student.motherName,
        parentContactNumber: student.parentContactNumber,
        parentEmailAddress: student.parentEmailAddress,
        gender: student.gender,
        dob: student.dob,
        address: student.address,
        schoolId: String(student.schoolId),
      },
      userId: {
        _id: String(user._id),
        email: user.email,
        status: user.status,
      },
      academicYear: String(studentAcademicProfile.academicYear),
      roll: studentAcademicProfile.roll,
      classId: {
        _id: String(studentClass._id),
        name: studentClass.name,
        section: studentClass.section,
      },
    };
  }
}
