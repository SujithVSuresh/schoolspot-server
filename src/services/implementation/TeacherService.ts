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
import { TeacherBySchoolResponseDTO } from "../../dto/TeacherDTO";

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

  async getTeachers(
    data: GetTeacherParamsType,
    schoolId: string
  ): Promise<GetTeacherResponseType> {
    const teachers = await this._teacherRepository.getAllTeachers(
      {
        limit: data.limit ? Number(data.limit) : 3,
        page: data.page ? Number(data.page) : 1,
        search: data.search ? data.search : "",
        sortBy: data.sortBy ? data.sortBy : "createdAt",
        sortOrder: data.sortOrder ? data.sortOrder : "desc",
        status: data.status ? data.status : "",
      },
      schoolId
    );

    return teachers;
  }

  async getTeacherBySchool(schoolId: string): Promise<TeacherBySchoolResponseDTO[]> {
    const teachers = await this._teacherRepository.getTeacherBySchool(schoolId)
    return teachers
  }
}
