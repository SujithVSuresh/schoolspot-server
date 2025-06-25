import { Request, Response, NextFunction } from "express";
import HttpStatus from "../../constants/StatusConstants";
import { ITeacherService } from "../../services/interface/ITeacherService";
import { ITeacherController } from "../interface/ITeacherController";
import { CustomRequest, PayloadType } from "../../types/types";



export class TeacherController implements ITeacherController {
    constructor(private _teacherService: ITeacherService) {}

    async addTeacher(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const {
                fullName,
                phoneNumber,
                subjectSpecialized,
                qualification,
                experience,
                email,
                password
              } = req.body;

              const {schoolId} = req.user as PayloadType

              const file = req.file

              const student = await this._teacherService.addTeacher({
                fullName,
                phoneNumber,
                subjectSpecialized,
                qualification,
                experience,
                email,
                password,
                
              }, file as  Express.Multer.File, schoolId)

              res.status(HttpStatus.CREATED).json({email: student})
              
        }catch(err){
            next(err)
        }
    }


    async updateTeacher(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {
                fullName,
                phoneNumber,
                subjectSpecialized,
                qualification,
                experience,
                email
              } = req.body;

              const {userId} = req.params

              const file = req.file ? req.file : null

              const student = await this._teacherService.updateTeacher(userId, {
                fullName,
                phoneNumber,
                subjectSpecialized,
                qualification,
                experience,
                email,                
              }, file as  Express.Multer.File)

              res.status(HttpStatus.CREATED).json({email: student})
              
        }catch(err){
            next(err)
        }
    }

    async getTeachers(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const {schoolId} = req.user as PayloadType

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";

            const teachers = await this._teacherService.getTeachers({page, limit, search}, schoolId)

            res.status(HttpStatus.OK).json(teachers)
              
        }catch(err){
            next(err)
        }
    }

    async getTeacherBySchool(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const {schoolId} = req.user as PayloadType

            const teachers = await this._teacherService.getTeacherBySchool(schoolId)

            res.status(HttpStatus.OK).json(teachers)

        }catch(err){
            next(err)
        }
    }


    async getTeacherProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const userId = req.user?.userId

            const teacherProfile = await this._teacherService.getTeacherProfile(userId as string)

            res.status(HttpStatus.OK).json(teacherProfile)

        }catch(err){
            next(err)
        }
    }

    async getTeacherProfileById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {userId} = req.params

            const teacherProfile = await this._teacherService.getTeacherProfile(userId as string)

            res.status(HttpStatus.OK).json(teacherProfile)

        }catch(err){
            next(err)
        }
    }



}