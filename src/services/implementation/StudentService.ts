import { IStudentRepository } from "../../repositories/interface/IStudentRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { IClassRepository } from "../../repositories/interface/IClassRepository";

import { IStudentService } from "../interface/IStudentService";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { hashPassword } from "../../utils/PasswordHash";
import cloudinary from "../../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import mongoose from "mongoose";
import {
  CreateStudentDTO,
  StudentPagenationResponseDTO,
  StudentResponseDTO,
  StudentSearchQueryDTO,
  StudentWithAcademicProfileResponseDTO,
  UpdateStudentDTO,
} from "../../dto/StudentDTO";
import { UserEntityType } from "../../types/UserType";
import { IStudentAcademicProfileRepository } from "../../repositories/interface/IStudentAcademicProfileRepository";
import { ClassEntityType } from "../../types/ClassType";
import { SchoolProfileEntityType } from "../../types/SchoolProfileType";

export class StudentService implements IStudentService {
  constructor(
    private _studentRepository: IStudentRepository,
    private _userRepository: IUserRepository,
    private _classRepository: IClassRepository,
    private _studentAcademicProfileRepository: IStudentAcademicProfileRepository
  ) {}

  async addStudent(
    data: CreateStudentDTO,
    file: Express.Multer.File
  ): Promise<{ email: string; userId: string; profileId: string }> {
    const existingUser = await this._userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new CustomError(Messages.USER_EXIST, HttpStatus.CONFLICT);
    }

    // const classExist = await this._classRepository.findClassById(classId);
    // if (!classExist) {
    //   throw new CustomError(Messages.CLASS_NOT_FOUNT, HttpStatus.NOT_FOUND);
    // }

    // const rollExist = await this._studentRepository.getStudent({
    //   roll: data.roll,
    //   classId: classId,
    // });

    // if (rollExist) {
    //   throw new CustomError(Messages.ROLL_EXIST, HttpStatus.CONFLICT);
    // }

    const password = await hashPassword(data.password as string);

    let user = await this._userRepository.createUser({
      email: data.email,
      password: password,
      role: "student",
      status: "active",
      schoolId: new mongoose.Types.ObjectId(data.schoolId),
      authProvider: "email",
    });

    let profilePhotoURL = null;

    if (file) {
      console.log("Uploading image to Cloudinary...");

      const uploadResult: UploadApiResponse = await new Promise(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "student_profiles" },
            (error, result) => {
              if (error) {
                reject(error);
              } else if (result) {
                resolve(result);
              } else {
                reject(new Error("Cloudinary upload failed"));
              }
            }
          );
          stream.end(file.buffer);
        }
      );

      profilePhotoURL = uploadResult.secure_url;
    }

    const profile = await this._studentRepository.createStudentProfile({
      fullName: data.fullName,
      address: data.address,
      dob: data.dob,
      gender: data.gender,
      fatherName: data.fatherName,
      motherName: data.motherName,
      parentContactNumber: data.parentContactNumber,
      parentEmailAddress: data.parentEmailAddress,
      admissionNo: data.admissionNo,
      profilePhoto: profilePhotoURL as string,
      userId: String(user._id),
      schoolId: data.schoolId,
    });

    // add it to studnet academic profile
    // await this._classRepository.updateClassStrength(String(profile.classId), 1);

    return {
      email: user.email,
      userId: String(user._id),
      profileId: String(profile._id),
    };
  }

  // async updateStudent(
  //   data: UpdateStudentDTO,
  //   studentId: string,
  //   file?: Express.Multer.File
  // ): Promise<{ email: string; userId: string; classId: string }> {
  //   const existingUser = await this._userRepository.findByEmail(data.email);
  //   if (existingUser && String(existingUser._id) != studentId) {
  //     throw new CustomError(Messages.USER_EXIST, HttpStatus.CONFLICT);
  //   }

  //   const studentProfile = await this._studentRepository.getStudentById(
  //     studentId
  //   );

  //   if (!studentProfile) {
  //     throw new CustomError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
  //   }

  //   const rollExist = await this._studentRepository.getStudent({
  //     roll: data.roll,
  //     classId: studentProfile?.classId,
  //   });

  //   if (
  //     rollExist &&
  //     rollExist._id?.toString() != studentProfile?._id?.toString()
  //   ) {
  //     throw new CustomError(Messages.ROLL_EXIST, HttpStatus.CONFLICT);
  //   }

  //   let user = await this._userRepository.updateUser(
  //     studentProfile?.user._id as string,
  //     {
  //       email: data.email,
  //     }
  //   );

  //   if (!user) {
  //     throw new CustomError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  //   }

  //   let profilePhotoURL = null;

  //   if (file) {
  //     console.log("Uploading image to Cloudinary...");

  //     const uploadResult: UploadApiResponse = await new Promise(
  //       (resolve, reject) => {
  //         const stream = cloudinary.uploader.upload_stream(
  //           { folder: "student_profiles" },
  //           (error, result) => {
  //             if (error) {
  //               reject(error);
  //             } else if (result) {
  //               resolve(result);
  //             } else {
  //               reject(new Error("Cloudinary upload failed"));
  //             }
  //           }
  //         );
  //         stream.end(file.buffer);
  //       }
  //     );

  //     profilePhotoURL = uploadResult.secure_url;
  //   }

  //   const profile = await this._studentRepository.updateStudentProfile(
  //     studentProfile?._id as string,
  //     {
  //       fullName: data.fullName,
  //       address: data.address,
  //       dob: data.dob,
  //       roll: data.roll,
  //       gender: data.gender,
  //       fatherName: data.fatherName,
  //       motherName: data.motherName,
  //       contactNumber: data.contactNumber,
  //       profilePhoto: profilePhotoURL
  //         ? profilePhotoURL
  //         : studentProfile?.profilePhoto,
  //     }
  //   );

  //   if (!profile) {
  //     throw new CustomError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
  //   }

  //   return {
  //     email: user?.email,
  //     userId: String(user._id),
  //     classId: String(profile.classId),
  //   };
  // }

  async getStudentsBySchool(
    data: StudentSearchQueryDTO,
    schoolId: string
  ): Promise<StudentPagenationResponseDTO> {
    const studentsData = await this._studentRepository.getStudentsBySchool(
      data,
      schoolId
    );

    const totalStudents =
      await this._studentRepository.findStudentsCountBySchool(schoolId);

    return {
      totalStudents,
      totalPages: Math.ceil(totalStudents / (data.limit as number)),
      currentPage: data.page as number,
      students: studentsData.map((student) => {
        const userId = student.userId as UserEntityType;
        return {
          _id: String(student._id),
          fullName: student.fullName,
          profilePhoto: student.profilePhoto,
          admissionNo: student.admissionNo,
          fatherName: student.fatherName,
          motherName: student.motherName,
          parentContactNumber: student.parentContactNumber,
          parentEmailAddress: student.parentEmailAddress,
          userId: {
            _id: String(userId._id),
            email: userId.email,
            status: userId.status,
          },
        };
      }),
    };
  }

  async getStudentById(userId: string): Promise<StudentWithAcademicProfileResponseDTO> {
    const student = await this._studentRepository.getStudentById(userId);

    if (!student) {
      throw new CustomError(Messages.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const studentAcademicProfileData =
      await this._studentAcademicProfileRepository.findAcademicProfile({
        studentId: student._id,
      });

    const user = student.userId as UserEntityType;

    const classData = studentAcademicProfileData.classId; 

    const school = student.schoolId as SchoolProfileEntityType

    return {
      _id: String(student._id),
      fullName: student.fullName,
      address: student.address,
      dob: student.dob,
      fatherName: student.fatherName,
      motherName: student.motherName,
      gender: student.gender,
      profilePhoto: student.profilePhoto,
      schoolId: {
        _id: String(school._id),
        schoolName: school.schoolName
      },
      admissionNo: student.admissionNo,
      parentContactNumber: student.parentContactNumber,
      parentEmailAddress: student.parentEmailAddress,
      userId: {
        _id: String(user._id),
        email: user.email,
        status: user.status,
      },
      academicProfile:
        classData && typeof classData === "object" && "name" in classData
          ? {
              _id: String(classData?._id),
              name: classData.name,
              section: classData.section,
              roll: studentAcademicProfileData.roll
            }
          : null,
    };
  }

  // async getStudentsByClassId(
  //   classId: string,
  //   schoolId: string
  // ): Promise<StudentResponseDTO[]> {
  //   const query = { classId: new mongoose.Types.ObjectId(classId) };
  //   return await this._studentRepository.getStudents(query, schoolId);
  // }

  // async getStudentsByQuery(query: any, schoolId: string): Promise<any> {
  //   return await this._studentRepository.getStudents(query, schoolId);
  // }
}
