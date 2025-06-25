import { ITeacherRepository } from "../../repositories/interface/ITeacherRepository";
import { ITeacherService } from "../interface/ITeacherService";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { TeacherUserProfileType } from "../../types/types";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { hashPassword } from "../../utils/PasswordHash";
import cloudinary from "../../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import mongoose, { ObjectId } from "mongoose";
import {
  GetTeacherParamsType,
  GetTeacherResponseType,
} from "../../types/types";
import {
  TeacherBySchoolResponseDTO,
  TeacherProfileResponseDTO,
  TeachersWithPagenationResponseDTO,
  UpdateTeacherDTO,
} from "../../dto/TeacherDTO";

export class TeacherService implements ITeacherService {
  constructor(
    private _teacherRepository: ITeacherRepository,
    private _userRepository: IUserRepository
  ) {}

  async addTeacher(
    data: TeacherUserProfileType,
    file: Express.Multer.File,
    schoolId: string
  ): Promise<string> {
    const existingUser = await this._userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new CustomError(Messages.USER_EXIST, HttpStatus.CONFLICT);
    }
    const password = await hashPassword(data.password as string);

    let user = await this._userRepository.createUser({
      email: data.email,
      password: password,
      role: "teacher",
      status: "active",
      schoolId: new mongoose.Types.ObjectId(schoolId),
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

    let teacherProfile = await this._teacherRepository.createTeacherProfile({
      fullName: data.fullName,
      phoneNumber: data.phoneNumber,
      subjectSpecialized: data.subjectSpecialized,
      qualification: data.qualification,
      experience: data.experience,
      profilePhoto: profilePhotoURL as string,
      userId: user._id as mongoose.Types.ObjectId,
      schoolId: new mongoose.Types.ObjectId(schoolId),
    });

    return user.email;
  }

  async updateTeacher(
    userId: string,
    data: UpdateTeacherDTO,
    file: Express.Multer.File
  ): Promise<{ email: string; userId: string }> {
    const existingUser = await this._userRepository.findByEmail(data.email);
    if (existingUser && String(existingUser._id) != userId) {
      throw new CustomError(Messages.USER_EXIST, HttpStatus.CONFLICT);
    }

    let user = await this._userRepository.updateUser(userId, {
      email: data.email,
    });

    if (!user) {
      throw new CustomError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const teacher = await this._teacherRepository.findTeacherProfile(userId);

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

    let teacherProfile = await this._teacherRepository.updateTeacherProfile(
      String(teacher?._id),
      {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        subjectSpecialized: data.subjectSpecialized,
        qualification: data.qualification,
        experience: data.experience,
        profilePhoto: profilePhotoURL ? profilePhotoURL : teacher?.profilePhoto,
      }
    );

    if (!teacherProfile) {
      throw new CustomError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      email: user?.email,
      userId: String(user._id),
    };
  }

  async getTeachers(
    data: GetTeacherParamsType,
    schoolId: string
  ): Promise<TeachersWithPagenationResponseDTO> {
    const skip = (data.page - 1) * data.limit;
    const teachers = await this._teacherRepository.getAllTeachers(
      { skip, limit: data.limit, search: data.search },
      schoolId
    );

    const teacherCount = await this._teacherRepository.teachersCount(
      { search: data.search },
      schoolId
    );

    return {
      data: teachers.map((teacher) => {
        return {
          _id: String(teacher._id),
          fullName: teacher.fullName,
          phoneNumber: teacher.phoneNumber,
          subjectSpecialized: teacher.subjectSpecialized,
          qualification: teacher.qualification,
          experience: teacher.experience,
          profilePhoto: teacher.profilePhoto ? teacher.profilePhoto : "",
          schoolId: String(teacher.schoolId),
          user: {
            _id: String(teacher.user?._id),
            email: teacher.user.email,
            status: teacher.user.status,
          },
        };
      }),
      currentPage: data.page,
      pageSize: data.limit,
      totalItems: teacherCount.totalItems,
      totalPages: Math.ceil(teacherCount.totalItems / data.limit),
    };
  }

  async getTeacherBySchool(
    schoolId: string
  ): Promise<TeacherBySchoolResponseDTO[]> {
    const teachers = await this._teacherRepository.getTeacherBySchool(schoolId);
    return teachers;
  }

  async getTeacherProfile(userId: string): Promise<TeacherProfileResponseDTO> {
    const teacherProfile = await this._teacherRepository.findTeacherProfile(
      userId
    );

    if (!teacherProfile) {
      throw new CustomError(Messages.PROFILE_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      _id: String(teacherProfile._id),
      fullName: teacherProfile.fullName,
      phoneNumber: teacherProfile.phoneNumber,
      subjectSpecialized: teacherProfile.subjectSpecialized,
      qualification: teacherProfile.qualification,
      experience: teacherProfile.experience,
      profilePhoto: teacherProfile.profilePhoto
        ? teacherProfile.profilePhoto
        : "",
      schoolId: String(teacherProfile.schoolId),
      user: {
        _id: String(teacherProfile.user?._id),
        email: teacherProfile.user.email,
        status: teacherProfile.user.status,
      },
    };
  }
}
