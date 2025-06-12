import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { UserResponseType, UserType, PayloadType } from "../../types/types";
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
import { IPlanRepository } from "../../repositories/interface/IPlanRespository";
import { CreateSchoolProfileDTO } from "../../dto/SchoolDTO";
import { ISchoolService } from "../interface/ISchoolService";
import { CreateUserDTO, UserResponseDTO } from "../../dto/UserDTO";
import { IAcademicYearService } from "../interface/IAcademicYearService";

export class AuthService implements IAuthService {
  constructor(
    private _userRepository: IUserRepository,
    private _schoolRepository: ISchoolRepository,
    private _subscriptionRepository: ISubscriptionRepository,
    private _subscriptionService: ISubscriptionService,
    private _planRepository: IPlanRepository,
    private _schoolService: ISchoolService,
    private _academicYearService: IAcademicYearService
  ) {}

  async signup(
    user: CreateUserDTO,
    school: CreateSchoolProfileDTO,
    academicYear: string
  ): Promise<string> {
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

    const academicYearResponse = await redisClient.setEx(
      `academicYear-${user.email}`,
      300,
      JSON.stringify({ academicYear })
    ); 

    if (!dataResponse || !otpResponse || !schoolDataResponse || !academicYearResponse) {
      throw new CustomError(
        Messages.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return user.email;
  }

  async verify(otpCode: number, email: string): Promise<UserResponseDTO> {
    const otpResponse = await redisClient.get(`otp-${email}`);
    if (!otpResponse) {
      throw new CustomError(Messages.OTP_EXPIRY, HttpStatus.FORBIDDEN);
    }

    const { otp } = JSON.parse(otpResponse);

    if (String(otpCode) != String(otp)) {
      throw new CustomError(Messages.INVALID_OTP, HttpStatus.UNAUTHORIZED);
    }


    // if (!otpResponse) {
    //   throw new CustomError(
    //     "Your session has expired. Signup again to continue",
    //     HttpStatus.FORBIDDEN
    //   );
    // }

    const schoolDataResponse = await redisClient.get(`schoolData-${email}`);

    const academicYearResponse = await redisClient.get(`academicYear-${email}`);

    const userDataResponse = await redisClient.get(`userData-${email}`);


    const { school } = JSON.parse(schoolDataResponse as string);
    const { user } = JSON.parse(userDataResponse as string);
    const { academicYear } = JSON.parse(academicYearResponse as string);

    if(!school || !user || !academicYear){
      throw new CustomError(Messages.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    const schoolData = await this._schoolService.createSchool(school);

    let userData = await this._userRepository.createUser({
      ...user,
      schoolId: schoolData._id,
    });

    const plan = await this._planRepository.findPlanByDuration(30);

    const allPlans = await this._planRepository.findAllPlans()

    console.log(plan, "this is the plan", allPlans)

    if (!plan) {
      throw new CustomError(Messages.PLAN_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this._subscriptionRepository.createSubscription({
      userId: String(userData._id),
      schoolId: String(userData.schoolId),
      planId: String(plan._id),
      planPrice: plan.price,
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
      status: "active",
    });

      console.log("2")

    const payload: PayloadType = {
      userId: String(userData._id),
      role: "admin",
      schoolId: String(schoolData._id),
      subscribed: true,
    };

    const accessToken = authToken.generateAccessToken(payload);
    
    const refreshToken = authToken.generateRefreshToken(payload);
    
    await this._academicYearService.createAcademicYear({
      name: academicYear,
      isActive: true,
      schoolId: String(schoolData._id)
    })

      console.log("3", refreshToken)

    return {
      _id: String(userData._id),
      email: userData.email,
      role: userData.role,
      status: userData.status,
      authProvider: userData.authProvider,
      accessToken,
      refreshToken,
      schoolId: String(userData.schoolId),
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
  ): Promise<UserResponseDTO> {
    const user = await this._userRepository.findByEmail(email);
    console.log(user, "user");

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

      isSubscriptionActive = checkSubscription(String(subscription.endDate));
    }

    const payload: PayloadType = {
      userId: String(user._id),
      role: user.role,
      schoolId: String(user.schoolId),
    };

    if (isSubscriptionActive !== null) {
      payload.subscribed = isSubscriptionActive;
    }

    const accessToken = authToken.generateAccessToken(payload);

    const refreshToken = authToken.generateRefreshToken(payload);

    return {
      _id: String(user._id),
      email: user.email,
      role: user.role,
      schoolId: String(user.schoolId),
      authProvider: user.authProvider,
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
    schoolData: CreateSchoolProfileDTO
  ): Promise<UserResponseDTO> {
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
            city: schoolData.address.city,
            state: schoolData.address.state,
            country: schoolData.address.country,
            postalCode: schoolData.address.postalCode,
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
          schoolId: String(school._id),
          authProvider: "google"
        });

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
        schoolId: String(userData.schoolId),
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

  async refreshToken(token: string): Promise<UserResponseDTO> {
    const payload = authToken.verifyRefreshToken(token);

    if (!payload) {
      throw new CustomError(Messages.INVALID_TOKEN, HttpStatus.FORBIDDEN);
    }

    const user = await this._userRepository.findUserById(payload.userId);

    if (!user) {
      throw new CustomError(Messages.USER_NOT_FOUND, HttpStatus.FORBIDDEN);
    }

    const subscription = await this._subscriptionService.handleSubscription(
      String(user.schoolId)
    );

    const accessToken = authToken.generateAccessToken({
      userId: String(payload.userId),
      role: payload.role,
      schoolId: String(payload.schoolId),
      subscribed: subscription
    });

    return {
      _id: String(user._id),
      email: user.email,
      role: user.role,
      status: user.status,
      schoolId: String(user.schoolId),
      authProvider: user.authProvider,
      accessToken: accessToken,
    };
  }

  async createUser(user: CreateUserDTO): Promise<UserResponseDTO> {
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
      schoolId: String(userData.schoolId),
      authProvider: userData.authProvider
    };
  }

  async changeAccountStatus(
    userId: string,
    status: "active" | "inactive" | "deleted" | "blocked",
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

    if(updateUserStatus?.status == "blocked"){
    await redisClient.setEx(`blocked:${userId}`, 1296000, 'true');
    }else if(updateUserStatus?.status == "active"){
     await redisClient.del(`blocked:${userId}`); 
    }
    return {
      userId: String(user._id),
      status: updateUserStatus?.status as
        | "active"
        | "inactive"
        | "deleted"
        | "blocked",
    };
  }

  // async getAllStudents(): Promise<UserType[]> {
  //   const students = await this._userRepository.listAllStudents();

  //   return students ?? [];
  // }

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
