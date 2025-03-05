import { IStudentRepository } from "../../repositories/interface/IStudentRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { StudentUserProfileType } from "../../types/types";
import { IStudentService } from "../interface/IStudentService";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { hashPassword } from "../../utils/PasswordHash";
import { GetParamsType } from "../../types/types";


export class StudentService implements IStudentService {
    constructor(
        private _studentRepository: IStudentRepository,
        private _userRepository: IUserRepository
    ) {}


    async addStudent(data: StudentUserProfileType): Promise<string> {
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
            profilePhoto: data.profilePhoto,
            userId: user._id
        })

        return user.email

    }

    async getStudents(data: GetParamsType): Promise<any> {
        const students = this._studentRepository.getAllStudents({limit: data.limit as number, page: data.page as number})
        console.log(students, "all students data")

        return students
    }

}