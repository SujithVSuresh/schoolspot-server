
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
import authToken from "../../utils/AuthToken";
import { comparePassword } from "../../utils/PasswordHash";
import { LoginResponseType } from "../../types/types";


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


    async verify(otpCode: number, email: string): Promise<Partial<UserType>> {
        const otpResponse = await redisClient.get(`otp-${email}`);
        if (!otpResponse) {
          throw new CustomError(Messages.OTP_EXPIRY, HttpStatus.FORBIDDEN);
        }
    
        const { otp } = JSON.parse(otpResponse);
    
        if (String(otpCode) != String(otp)) {
          throw new CustomError(Messages.INVALID_OTP, HttpStatus.UNAUTHORIZED);
        }
    
        const dataResponse = await redisClient.get(`userData-${email}`);
    
        if (!otpResponse) {
          throw new CustomError("Your session has expired. Signup again to continue", HttpStatus.FORBIDDEN);
        }
    
        const { user } = JSON.parse(dataResponse as string);
    
        let userData = await this._userRepository.createUser({
          ...user,
          role: "admin",
          status: "active",
        });
    
        return {
          _id: userData._id,
          email: userData.email,
          role: userData.role,
          status: userData.status,
        };
      }


      async resendOtp(email: string): Promise<string> {
        const getUser = await redisClient.get(`userData-${email}`);
        if (!getUser) {
          throw new CustomError("Your session has expired. Signup again to continue", HttpStatus.FORBIDDEN);
        }
    
        const otpCode = generateOtp();
        
        await sendOtpEmail(email, otpCode);
    
        const setUser = await redisClient.setEx(
          `otp-${email}`,
          60,
          JSON.stringify(otpCode)
        );
    
        if (!setUser) {
          throw new CustomError(
            Messages.SERVER_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
    
        return email
      }



      async signin(email: string, password: string): Promise<LoginResponseType> {
        const user = await this._userRepository.findByEmail(email);
    
        if (!user) {
          throw new CustomError(
            Messages.ACCOUNT_NOT_FOUND,
            HttpStatus.UNAUTHORIZED
          );
        }
    
        const pwMatch = await comparePassword(password, user.password as string);
    
        if (!pwMatch) {
          throw new CustomError(
            Messages.ACCOUNT_NOT_FOUND,
            HttpStatus.UNAUTHORIZED
          );
        }
    
        const accessToken = authToken.generateAccessToken({
          userId: String(user._id),
          role: "admin",
          iat: Date.now(),
        });
    
        const refreshToken = authToken.generateRefreshToken({
          userId: String(user._id),
          role: "admin",
          iat: Date.now(),
        });
    
        return {
          _id: String(user._id),
          email: user.email,
          role: user.role,
          status: user.status,
          accessToken: accessToken,
          refreshToken: refreshToken,
        };
      }
}







