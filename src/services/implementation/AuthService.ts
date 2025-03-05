import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { UserResponseType, UserType } from "../../types/types";
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
import { generateToken } from "../../utils/TokenGenerator";
import { sendPasswordResetEmail } from "../../utils/SendEmail";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import mongoose from "mongoose";

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


    async verify(otpCode: number, email: string): Promise<UserResponseType> {
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
          status: "inactive",
        });

        const accessToken = authToken.generateAccessToken({
          userId: String(userData._id),
          role: "admin",
          iat: Date.now(),
        });
    
        const refreshToken = authToken.generateRefreshToken({
          userId: String(userData._id),
          role: "admin",
          iat: Date.now(),
        });
    
        return {
          _id: String(userData._id),
          email: userData.email,
          role: userData.role,
          status: userData.status,
          accessToken,
          refreshToken
        };
      }

      async createUser(user: UserType): Promise<UserResponseType> {
        const existingUser = await this._userRepository.findByEmail(user.email);
        if (existingUser) {
          throw new CustomError(Messages.USER_EXIST, HttpStatus.CONFLICT);
        }
        user.password = await hashPassword(user.password as string);

        let userData = await this._userRepository.createUser({
          ...user,
          status: "inactive"
        });

        return {
          _id: String(userData._id),
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



      async signin(email: string, password: string): Promise<UserResponseType> {
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

      async passwordResetRequest(email: string): Promise<string> {
        const token = await generateToken(32);
    
        await redisClient.setEx(`token-${token}`, 500, JSON.stringify(email));
    
        await sendPasswordResetEmail(email, token);
    
        return email;
      }


      async passwordReset(token: string, password: string): Promise<string> {
        const response = await redisClient.get(`token-${token}`);
    
        if (!response) {
          throw new CustomError(Messages.TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED);
        }
    
        const user = await this._userRepository.findByEmail(JSON.parse(response));
    
        if (!user) {
          throw new CustomError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
    
        user.password = await hashPassword(password);
    
        const updateUser = await this._userRepository.updateUser(
          String(user?._id),
          user
        );
    
        return updateUser?.email as string;
      }


      async googleAuth(credential: string, clientId: string): Promise<UserResponseType> {

        const client = new OAuth2Client();

        const ticket = await client.verifyIdToken({
          idToken: credential,
          audience: clientId,
        });

        const payload = ticket.getPayload() as TokenPayload;
        const userid = payload['sub'];

        if(payload.email){
        let userData = await this._userRepository.findByEmail(payload.email);



        if(!userData){
          userData = await this._userRepository.createUser({
            email: payload.email,
            role: "admin",
            status: "inactive",
          });
        }

 
          let accessToken = authToken.generateAccessToken({
            userId: String(userData?._id),
            role: "admin",
            iat: Date.now(),
          });
      
          let refreshToken = authToken.generateRefreshToken({
            userId: String(userData?._id),
            role: "admin",
            iat: Date.now(),
          });
        

        return {
          _id: String(userData._id),
          email: userData.email,
          role: userData.role,
          status: userData.status,
          accessToken: accessToken,
          refreshToken: refreshToken,
        };
        }else{
          throw new CustomError(Messages.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
        }     
      }


      async getAllStudents(): Promise<UserType[]> {

        const students = await this._userRepository.listAllStudents();

        return students ?? [];
      }
}







