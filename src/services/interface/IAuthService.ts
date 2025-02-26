import { UserType } from "../../types/types";



export interface IAuthService{
    signup(user: UserType): Promise<string>
    verify(otpCode: number, email: string): Promise<Partial<UserType>>
    resendOtp(email: string): Promise<string>

}