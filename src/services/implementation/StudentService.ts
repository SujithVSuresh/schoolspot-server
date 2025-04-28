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
  UpdateStudentDTO,
} from "../../dto/StudentDTO";

export class StudentService implements IStudentService {
  constructor(
    private _studentRepository: IStudentRepository,
    private _userRepository: IUserRepository,
    private _classRepository: IClassRepository
  ) {}

  async addStudent(
    data: CreateStudentDTO,
    file: Express.Multer.File,
    schoolId: string,
    classId: string
  ): Promise<{ email: string; userId: string; classId: string }> {
    const existingUser = await this._userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new CustomError(Messages.USER_EXIST, HttpStatus.CONFLICT);
    }

    const classExist = await this._classRepository.findClassById(classId);
    if (!classExist) {
      throw new CustomError(Messages.CLASS_NOT_FOUNT, HttpStatus.NOT_FOUND);
    }

    const rollExist = await this._studentRepository.getStudent({
      roll: data.roll,
      classId: classId,
    });

    if (rollExist) {
      throw new CustomError(Messages.ROLL_EXIST, HttpStatus.CONFLICT);
    }

    const password = await hashPassword(data.password as string);

    let user = await this._userRepository.createUser({
      email: data.email,
      password: password,
      role: "student",
      status: "active",
      schoolId: new mongoose.Types.ObjectId(schoolId),
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
      class: classExist.name,
      section: classExist.section,
      classId: classId,
      address: data.address,
      dob: data.dob,
      roll: data.roll,
      gender: data.gender,
      fatherName: data.fatherName,
      motherName: data.motherName,
      contactNumber: data.contactNumber,
      profilePhoto: profilePhotoURL as string,
      userId: String(user._id),
      schoolId: schoolId,
    });

    await this._classRepository.updateClassStrength(String(profile.classId), 1);

    return {
      email: user.email,
      userId: String(user._id),
      classId: String(classExist._id),
    };
  }

  async updateStudent(
    data: UpdateStudentDTO,
    studentId: string,
    file?: Express.Multer.File
  ): Promise<{ email: string; userId: string; classId: string }> {
    const existingUser = await this._userRepository.findByEmail(data.email);
    if (existingUser && String(existingUser._id) != studentId) {
      throw new CustomError(Messages.USER_EXIST, HttpStatus.CONFLICT);
    }

    const studentProfile = await this._studentRepository.getStudentById(
      studentId
    );

    if (!studentProfile) {
      throw new CustomError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const rollExist = await this._studentRepository.getStudent({
      roll: data.roll,
      classId: studentProfile?.classId,
    });

    if (
      rollExist &&
      rollExist._id?.toString() != studentProfile?._id?.toString()
    ) {
      throw new CustomError(Messages.ROLL_EXIST, HttpStatus.CONFLICT);
    }

    let user = await this._userRepository.updateUser(
      studentProfile?.user._id as string,
      {
        email: data.email,
      }
    );

    if (!user) {
      throw new CustomError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

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

    const profile = await this._studentRepository.updateStudentProfile(
      studentProfile?._id as string,
      {
        fullName: data.fullName,
        address: data.address,
        dob: data.dob,
        roll: data.roll,
        gender: data.gender,
        fatherName: data.fatherName,
        motherName: data.motherName,
        contactNumber: data.contactNumber,
        profilePhoto: profilePhotoURL
          ? profilePhotoURL
          : studentProfile?.profilePhoto,
      }
    );

    if (!profile) {
      throw new CustomError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    console.log(user, "lll");

    return {
      email: user?.email,
      userId: String(user._id),
      classId: String(profile.classId),
    };
  }

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
        return {
          _id: String(student._id),
          fullName: student.fullName,
          class: student.class,
          section: student.section,
          roll: student.roll,
          profilePhoto: student.profilePhoto,
          user: {
            _id: String(student.user._id),
            email: student.user.email,
            status: student.user.status,
          },
        };
      }),
    };
  }

  async getStudentById(userId: string): Promise<StudentResponseDTO> {
    const student = await this._studentRepository.getStudentById(userId);

    if (!student) {
      throw new CustomError(Messages.ACCOUNT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      _id: String(student._id),
      fullName: student.fullName,
      class: student.class,
      section: student.section,
      address: student.address,
      roll: student.roll,
      contactNumber: student.contactNumber,
      dob: student.dob,
      fatherName: student.fatherName,
      motherName: student.motherName,
      gender: student.gender,
      profilePhoto: student.profilePhoto,
      schoolId: String(student.schoolId),
      classId: String(student.classId),
      user: {
        _id: String(student.user._id),
        email: student.user.email,
        status: student.user.status,
      },
    };
  }

  async getStudentsByClassId(
    classId: string,
    schoolId: string
  ): Promise<StudentResponseDTO[]> {
    const query = { classId: new mongoose.Types.ObjectId(classId) };
    return await this._studentRepository.getStudents(query, schoolId);
  }

  async getStudentsByQuery(query: any, schoolId: string): Promise<any> {
    return await this._studentRepository.getStudents(query, schoolId);
  }
}
