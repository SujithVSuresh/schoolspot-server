import { UserResponseType, UserType, SchoolProfileType, SchoolProfileReqType } from "../../types/types";


export interface IAuthService{
    signup(user: UserType, school: SchoolProfileType): Promise<string>
    verify(otpCode: number, email: string): Promise<UserResponseType>
    resendOtp(email: string): Promise<string>
    signin(email:string, password:string, role: string): Promise<UserResponseType>
    passwordResetRequest(email: string): Promise<string>
    passwordReset(token: string, password: string): Promise<string>
    googleAuth(credential: string, credentialId: string, schoolData: SchoolProfileReqType): Promise<UserResponseType>
    createUser(user: UserType): Promise<UserResponseType>
    getAllStudents(): Promise<UserType[]>
    refreshToken(token: string): Promise<UserResponseType>
    changeAccountStatus(userId: string, status: "active" | "inactive" | "deleted" | "blocked"): Promise<{
        userId: string,
        status: "active" | "inactive" | "deleted" | "blocked"
      }>
    changePassword(userId: string, data: {oldPassword: string, newPassword: string}): Promise<string> 
}