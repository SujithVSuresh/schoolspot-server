import HttpStatus from "../../constants/StatusConstants";
import {
  CreateStudentAcademicProfileDTO,
  StudentAcademicProfileResponseDTO,
  StudentAcademicProfileWithClassResponseDTO,
  StudentAcademicProfileWithProfileResponseDTO,
} from "../../dto/StudentDTO";
import { IStudentAcademicProfileRepository } from "../../repositories/interface/IStudentAcademicProfileRepository";
import { IStudentRepository } from "../../repositories/interface/IStudentRepository";
import { CustomError } from "../../utils/CustomError";
import { IStudentAcademicProfileService } from "../interface/IStudentAcademicProfileService";
import Messages from "../../constants/MessageConstants";
import mongoose from "mongoose";
import { StudentEntityType } from "../../types/StudentType";
import { ClassEntityType } from "../../types/ClassType";


export class StudentAcadmicProfileService
  implements IStudentAcademicProfileService
{
  constructor(
    private _studentAcademicProfileRepository: IStudentAcademicProfileRepository,
    private _studentRepository: IStudentRepository
  ) {}

  async createAcademicProfile(
    data: CreateStudentAcademicProfileDTO,
    admissionNo: string,
    schoolId: string
  ): Promise<StudentAcademicProfileResponseDTO> {
    const studentProfile = await this._studentRepository.getStudent({
      admissionNo,
      schoolId: new mongoose.Types.ObjectId(schoolId)
    }
    );

    if (!studentProfile) {
      throw new CustomError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const studentExist = await this._studentAcademicProfileRepository.findAcademicProfile({
      studentId: studentProfile._id
    });

    console.log(studentExist, "student exist...")

    if (studentExist) {
      throw new CustomError(Messages.STUDENT_ALREADY_EXIST, HttpStatus.CONFLICT);
    }

    const rollExist = await this._studentAcademicProfileRepository.findAcademicProfile({
      roll: data.roll,
      classId: new mongoose.Types.ObjectId(data.classId)
    });


    if (rollExist) {
      throw new CustomError(Messages.ROLL_EXIST, HttpStatus.CONFLICT);
    }

    const academicProfile =
      await this._studentAcademicProfileRepository.createAcademicProfile({
        userId: studentProfile.userId as string,
        studentId: studentProfile._id as string,
        roll: data.roll,
        classId: data.classId,
      });

    return {
      _id: String(academicProfile._id),
      userId: String(academicProfile.userId),
      studentId: String(academicProfile.studentId),
      roll: academicProfile.roll,
      classId: String(academicProfile.classId),
    };
  }

  async fetchStudentProfileByUserId(
    userId: string,
  ): Promise<StudentAcademicProfileWithClassResponseDTO> {

    const studentAcademicProfile = await this._studentAcademicProfileRepository.findAcademicProfile({
        userId: new mongoose.Types.ObjectId(userId),
      });


    if (!studentAcademicProfile) {
      throw new CustomError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const studentClass = studentAcademicProfile.classId as ClassEntityType;

    return {
      _id: String(studentAcademicProfile._id),
      studentId: String(studentAcademicProfile.userId),
      userId: String(studentAcademicProfile.userId),
      roll: studentAcademicProfile.roll,
      classId: {
        _id: String(studentClass._id),
        name: studentClass.name,
        section: studentClass.section,
      },
    };
  }


  async fetchAcademicProfilesByClassId(classId: string): Promise<StudentAcademicProfileWithProfileResponseDTO[]> {
    const response = await this._studentAcademicProfileRepository.findAcademicProfilesByClassId(classId)

    const academicProfiles: StudentAcademicProfileWithProfileResponseDTO[] = response.map((item) => {
      const student = item.studentId as StudentEntityType
      return {
        _id: String(item._id),
        classId: String(item.classId),
        roll: item.roll,
        userId: String(item.userId),
        studentId: {
          _id: String(student._id),
          fullName: student.fullName,
          profilePhoto: student.profilePhoto
        }
      }
    })

    return academicProfiles
  }
}
