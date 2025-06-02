import { NextFunction, Response } from "express";
import { CustomRequest } from "../../types/types";

export interface IStudentAcademicProfileController {
    createAcademicProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
    fetchStudentProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void>
}