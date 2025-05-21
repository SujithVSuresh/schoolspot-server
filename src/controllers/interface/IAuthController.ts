import { Request, Response,NextFunction } from "express";


export interface IAuthController {
    signup(req: Request, res: Response, next: NextFunction): Promise<void>
    verify(req: Request, res: Response, next: NextFunction): Promise<void>
    resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>
    signin(req: Request, res: Response, next: NextFunction): Promise<void>
    passwordResetRequest(req: Request, res: Response, next:NextFunction): Promise<void>
    resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>
    googleAuth(req: Request, res: Response, next:NextFunction): Promise<void>
    createUser(req: Request, res: Response, next:NextFunction): Promise<void>
    // getAllStudents(req: Request, res: Response, next: NextFunction): Promise<void>
    refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>
    changeAccountStatus(req: Request, res: Response, next: NextFunction): Promise<void>
}