import { UserType } from "../../types/types";
import { LoginResponseType } from "../../types/types";


export interface IAuthService{
    signup(user: UserType): Promise<string>
    verify(otpCode: number, email: string): Promise<Partial<UserType>>
    resendOtp(email: string): Promise<string>
    signin(email:string, password:string): Promise<LoginResponseType>
    passwordResetRequest(email: string): Promise<string>
    passwordReset(token: string, password: string): Promise<string>
    googleAuth(credential: string, credentialId: string): Promise<LoginResponseType>
}