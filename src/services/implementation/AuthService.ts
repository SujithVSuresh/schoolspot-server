import { IUserRepository } from "../../repositories/interface/IUserRepository";
import {
  UserResponseType,
  UserType,
  SchoolProfileType,
  SchoolProfileReqType,
  PayloadType,
} from "../../types/types";
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
import { checkSubscription } from "../../utils/CheckSubscription";
import { sendPasswordResetEmail } from "../../utils/SendEmail";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { ISchoolRepository } from "../../repositories/interface/ISchoolRepository";
import { ChangePasswordRequestDTO } from "../../dto/AuthDTO";
import { ISubscriptionRepository } from "../../repositories/interface/ISubscriptionRepository";
import { ISubscriptionService } from "../interface/ISubscriptionService";

export class AuthService implements IAuthService {
  constructor(
    private _userRepository: IUserRepository,
    private _schoolRepository: ISchoolRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _subscriptionService: ISubscriptionService
  ) {}

  async signup(user: UserType, school: SchoolProfileType): Promise<string> {
    const existingUser = await this._userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new CustomError(Messages.USER_EXIST, HttpStatus.CONFLICT);
    }
    user.password = await hashPassword(user.password as string);
    const otp = generateOtp();

    await sendOtpEmail(user.email, otp);

    const dataResponse = await redisClient.setEx(
      `userData-${user.email}`,
      300,
      JSON.stringify({ user })
    );

    const schoolDataResponse = await redisClient.setEx(
      `schoolData-${user.email}`,
      300,
      JSON.stringify({ school })
    );

    const otpResponse = await redisClient.setEx(
      `otp-${user.email}`,
      70,
      JSON.stringify({ otp })
    );

    if (!dataResponse || !otpResponse || !schoolDataResponse) {
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

    const userDataResponse = await redisClient.get(`userData-${email}`);

    if (!otpResponse) {
      throw new CustomError(
        "Your session has expired. Signup again to continue",
        HttpStatus.FORBIDDEN
      );
    }

    const schoolDataResponse = await redisClient.get(`schoolData-${email}`);

    const { school } = JSON.parse(schoolDataResponse as string);

    const schoolData = await this._schoolRepository.createSchoolProfile({
      address: {
        city: school.city,
        country: school.postalCode,
        state: school.state,
        postalCode: school.postalCode,
      },
      ...school,
    });

    const { user } = JSON.parse(userDataResponse as string);

    let userData = await this._userRepository.createUser({
      ...user,
      role: "admin",
      status: "inactive",
      schoolId: schoolData._id,
    });

    const subscription = await this._subscriptionRepository.createSubscription({
      userId: String(userData._id),
      schoolId: String(userData.schoolId),
      planId: "dsaf",
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
      status: "active",
    });

    const accessToken = authToken.generateAccessToken({
      userId: String(userData._id),
      role: "admin",
      schoolId: String(schoolData._id),
      subscribed: true,
    });

    const refreshToken = authToken.generateRefreshToken({
      userId: String(userData._id),
      role: "admin",
      schoolId: String(schoolData._id),
      subscribed: true,
    });

    return {
      _id: String(userData._id),
      email: userData.email,
      role: userData.role,
      status: userData.status,
      accessToken,
      refreshToken,
      schoolId: userData.schoolId,
    };
  }

  async resendOtp(email: string): Promise<string> {
    const getUser = await redisClient.get(`userData-${email}`);
    if (!getUser) {
      throw new CustomError(
        "Your session has expired. Signup again to continue",
        HttpStatus.FORBIDDEN
      );
    }

    const otpCode = generateOtp();

    await sendOtpEmail(email, otpCode);

    const setUser = await redisClient.setEx(
      `otp-${email}`,
      70,
      JSON.stringify(otpCode)
    );

    if (!setUser) {
      throw new CustomError(
        Messages.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return email;
  }

  async signin(
    email: string,
    password: string,
    role: string
  ): Promise<UserResponseType> {
    const user = await this._userRepository.findByEmail(email);

    if (!user || (user && !user.password)) {
      throw new CustomError(
        Messages.ACCOUNT_NOT_FOUND,
        HttpStatus.UNAUTHORIZED
      );
    }

    if (user && user.role != role) {
      throw new CustomError(
        Messages.ACCOUNT_NOT_FOUND,
        HttpStatus.UNAUTHORIZED
      );
    }

    if (user && user.status == "blocked") {
      throw new CustomError(
        "Your account has been blocked",
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

    let isSubscriptionActive = null; 

    if (user.role != "superadmin") {
      const subscription = await this._subscriptionRepository.findSubscription({
        schoolId: String(user?.schoolId),
        status: "active",
      });

      if (!subscription) {
        throw new CustomError(
          Messages.SUBSCRIPTION_NOT_FOUND,
          HttpStatus.NOT_FOUND
        );
      }

      isSubscriptionActive = checkSubscription(
        String(subscription.endDate)
      );
    }

    const payload: PayloadType = {
      userId: String(user._id),
      role: user.role,
      schoolId: String(user.schoolId)
    }

    if(isSubscriptionActive !== null){
      payload.subscribed = isSubscriptionActive;
    } 

    const accessToken = authToken.generateAccessToken(payload);

    const refreshToken = authToken.generateRefreshToken(payload);

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

  async googleAuth(
    credential: string,
    clientId: string,
    schoolData: SchoolProfileReqType
  ): Promise<UserResponseType> {
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const payload = ticket.getPayload() as TokenPayload;

    if (payload.email) {
      let userData = await this._userRepository.findByEmail(payload.email);
      let school;
      let subscription;

      if (userData?._id) {
        school = await this._schoolRepository.findSchoolById(
          String(userData.schoolId)
        );
      } else {
        school = await this._schoolRepository.createSchoolProfile({
          address: {
            city: schoolData.city,
            state: schoolData.state,
            country: schoolData.country,
            postalCode: schoolData.postalCode,
          },
          board: schoolData.board,
          phoneNumber: schoolData.phoneNumber,
          schoolName: schoolData.schoolName,
          principalName: schoolData.principalName,
          regNumber: schoolData.regNumber,
          totalStudents: schoolData.totalStudents,
          totalTeachers: schoolData.totalTeachers,
          websiteUrl: schoolData.websiteUrl,
          yearEstablished: schoolData.yearEstablished,
        });

        userData = await this._userRepository.createUser({
          email: payload.email,
          role: "admin",
          status: "inactive",
          schoolId: school._id,
        });

        console.log(userData, "blaaaa");

        // subscription = await this._subscriptionRepository.createSubscription({
        //   userId: String(userData._id),
        //   schoolId: String(userData.schoolId),
        //   planId: "dsaf",
        //   startDate: new Date(),
        //   endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        //   status: "active",
        // });
      }

      let accessToken = authToken.generateAccessToken({
        userId: String(userData?._id),
        role: "admin",
        schoolId: String(school?._id),
        // subscribed: checkSubscription(String(subscription?.endDate))
        subscribed: true,
      });

      let refreshToken = authToken.generateRefreshToken({
        userId: String(userData?._id),
        role: "admin",
        schoolId: String(school?._id),
        // subscribed: checkSubscription(String(subscription?.endDate))
        subscribed: true,
      });

      return {
        _id: String(userData._id),
        email: userData.email,
        role: userData.role,
        status: userData.status,
        accessToken: accessToken,
        refreshToken: refreshToken,
        authProvider: userData.authProvider,
      };
    } else {
      throw new CustomError(
        Messages.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async refreshToken(token: string): Promise<UserResponseType> {
    const payload = authToken.verifyRefreshToken(token);

    if (!payload) {
      throw new CustomError(Messages.INVALID_TOKEN, HttpStatus.FORBIDDEN);
    }

    const user = await this._userRepository.findUserById(payload.userId);

    if (!user) {
      throw new CustomError(Messages.USER_NOT_FOUND, HttpStatus.FORBIDDEN);
    }

    // const subscription = await this._subscriptionService.handleSubscription(String(user.schoolId))

    const accessToken = authToken.generateAccessToken({
      userId: String(user._id),
      role: "admin",
      schoolId: String(user.schoolId),
      subscribed: true,
    });

    return {
      _id: String(user._id),
      email: user.email,
      role: user.role,
      status: user.status,
      accessToken: accessToken,
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
      status: "inactive",
    });

    return {
      _id: String(userData._id),
      email: userData.email,
      role: userData.role,
      status: userData.status,
    };
  }

  async changeAccountStatus(
    userId: string,
    status: "active" | "inactive" | "deleted" | "blocked"
  ): Promise<{
    userId: string;
    status: "active" | "inactive" | "deleted" | "blocked";
  }> {
    const user = await this._userRepository.findUserById(userId);
    if (!user) {
      throw new CustomError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const updateUserStatus = await this._userRepository.updateUser(userId, {
      status: status,
    });

    return {
      userId: String(user._id),
      status: updateUserStatus?.status as
        | "active"
        | "inactive"
        | "deleted"
        | "blocked",
    };
  }

  async getAllStudents(): Promise<UserType[]> {
    const students = await this._userRepository.listAllStudents();

    return students ?? [];
  }

  async changePassword(
    userId: string,
    data: ChangePasswordRequestDTO
  ): Promise<string> {
    const user = await this._userRepository.findUserById(userId);

    if (!user) {
      throw new CustomError(Messages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (user.authProvider == "google") {
      throw new CustomError(
        Messages.PASSWORD_CHANGE_NOT_ALLOWED,
        HttpStatus.FORBIDDEN
      );
    }

    const pwMatch = await comparePassword(
      data.oldPassword,
      user.password as string
    );

    if (!pwMatch) {
      throw new CustomError(
        Messages.ACCOUNT_NOT_FOUND,
        HttpStatus.UNAUTHORIZED
      );
    }

    const password = await hashPassword(data.newPassword as string);

    const updatePassword = await this._userRepository.updateUser(userId, {
      password,
    });

    return updatePassword?.email as string;
  }
}
