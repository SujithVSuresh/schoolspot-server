
import { CreateSchoolProfileDTO, SchoolProfileResponseDTO } from "../../dto/SchoolDTO";
import { CreateUserDTO, UserResponseDTO } from "../../dto/UserDTO";

export interface IAuthService{
    signup(user: CreateUserDTO, school: CreateSchoolProfileDTO, academicYear: string): Promise<string>
    verify(otpCode: number, email: string): Promise<UserResponseDTO>
    resendOtp(email: string): Promise<string>
    signin(email:string, password:string, role: string): Promise<UserResponseDTO>
    passwordResetRequest(email: string): Promise<string>
    passwordReset(token: string, password: string): Promise<string>
    googleAuth(credential: string, credentialId: string, schoolData: CreateSchoolProfileDTO): Promise<UserResponseDTO>
    createUser(user: CreateUserDTO): Promise<UserResponseDTO>
    // getAllStudents(): Promise<UserType[]>
    refreshToken(token: string): Promise<UserResponseDTO>
    changeAccountStatus(userId: string, status: "active" | "inactive" | "deleted" | "blocked"): Promise<{
        userId: string,
        status: "active" | "inactive" | "deleted" | "blocked"
      }>
    changePassword(userId: string, data: {oldPassword: string, newPassword: string}): Promise<string> 
}