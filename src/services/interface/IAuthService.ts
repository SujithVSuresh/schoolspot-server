import { UserResponseType, UserType } from "../../types/types";


export interface IAuthService{
    signup(user: UserType): Promise<string>
    verify(otpCode: number, email: string): Promise<UserResponseType>
    resendOtp(email: string): Promise<string>
    signin(email:string, password:string): Promise<UserResponseType>
    passwordResetRequest(email: string): Promise<string>
    passwordReset(token: string, password: string): Promise<string>
    googleAuth(credential: string, credentialId: string): Promise<UserResponseType>
    createUser(user: UserType): Promise<UserResponseType>
    getAllStudents(): Promise<UserType[]>
}