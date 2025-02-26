
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { UserType } from "../../types/types";
import { IAuthService } from "../interface/IAuthService";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { redisClient } from "../../config/redis";
import { hashPassword } from "../../utils/PasswordHash";
import { sendOtpEmail } from "../../utils/SendEmail";
import generateOtp from "../../utils/GenerateOTP";



export class AuthService implements IAuthService {
    constructor(private _userRepository: IUserRepository) {}



    async signup(user: UserType): Promise<string> {
        const existingUser = await this._userRepository.findByEmail(user.email);
        if (existingUser) {
          throw new CustomError(Messages.USER_EXIST, HttpStatus.CONFLICT);
        }
        user.password = await hashPassword(user.password as string);
        const otp = generateOtp();
        
        await sendOtpEmail(user.email, otp);
    
        const userData = {
          user: user,
          otp: otp,
        };
    
        const dataResponse = await redisClient.setEx(
          `userData-${user.email}`,
          300,
          JSON.stringify({user})
        );
    
        const otpResponse = await redisClient.setEx(
          `otp-${user.email}`,
          60,
          JSON.stringify({otp})
        );
    
        if (!dataResponse || !otpResponse) {
          throw new CustomError(
            Messages.SERVER_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
    
        return user.email;
    }
}







