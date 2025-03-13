import { IStudentRepository } from "../../repositories/interface/IStudentRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { GetStudentsResponseType, StudentUserProfileType } from "../../types/types";
import { IStudentService } from "../interface/IStudentService";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { hashPassword } from "../../utils/PasswordHash";
import { GetParamsType } from "../../types/types";
import cloudinary from "../../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import mongoose from "mongoose";



export class StudentService implements IStudentService {
    constructor(
        private _studentRepository: IStudentRepository,
        private _userRepository: IUserRepository
    ) {}


    async addStudent(data: StudentUserProfileType, file: Express.Multer.File, schoolId: string): Promise<string> {
        const existingUser = await this._userRepository.findByEmail(data.email);
        if (existingUser) {
          throw new CustomError(Messages.USER_EXIST, HttpStatus.CONFLICT);
        }
        const password = await hashPassword(data.password as string);

        let user = await this._userRepository.createUser({
            email: data.email,
            password: password,
            role: "student",
            status: "active",
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
                      reject(error); // Reject in case of error
                    } else if (result) {
                      resolve(result); // Resolve with Cloudinary result
                    } else {
                      reject(new Error("Cloudinary upload failed"));
                    }
                  }
                );
      
                stream.end(file.buffer); // Send file buffer to Cloudinary
              }
            );
      
            profilePhotoURL = uploadResult.secure_url;
          }   

          console.log(profilePhotoURL, "blenlennle")

        let studentProfile = await this._studentRepository.createStudentProfile({
            fullName: data.fullName,
            class: data.class,
            section: data.section,
            address: data.address,
            dob: data.dob,
            gender: data.gender,
            fatherName: data.fatherName,
            motherName: data.motherName,
            contactNumber: data.contactNumber,
            profilePhoto: profilePhotoURL as string,
            userId: user._id,
            schoolId: new mongoose.Types.ObjectId(schoolId)
        })

        return user.email

    }

    async getStudents(data: GetParamsType, schoolId: string): Promise<GetStudentsResponseType> {
        const students = await this._studentRepository.getAllStudents({
            limit: data.limit ? Number(data.limit) : 3, 
            page: data.page ? Number(data.page) : 1, 
            search: data.search ? data.search : "",
            sortBy: data.sortBy ? data.sortBy : "createdAt",
            sortOrder: data.sortOrder ? data.sortOrder : "desc",
            status: data.status ? data.status : ""
        }, schoolId);        

        return students
    }

}