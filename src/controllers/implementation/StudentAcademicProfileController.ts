import { NextFunction, Response } from "express";
import { IStudentAcademicProfileService } from "../../services/interface/IStudentAcademicProfileService";
import { IStudentAcademicProfileController } from "../interface/IStudentAcademicProfileController";
import { CustomRequest, PayloadType } from "../../types/types";
import { CreateStudentAcademicProfileDTO } from "../../dto/StudentDTO";
import HttpStatus from "../../constants/StatusConstants";



export class StudentAcademicProfileController implements IStudentAcademicProfileController {
    constructor(
        private _studentAcademicProfileService: IStudentAcademicProfileService
    ){}

    async createAcademicProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const data = req.body

            const {schoolId} = req.user as PayloadType

            const academicProfileData: CreateStudentAcademicProfileDTO = {
                roll: data.roll,
                classId: data.classId,
            }

            const academicProfile = await this._studentAcademicProfileService.createAcademicProfile(academicProfileData, data.admissionNo, schoolId)

            res.status(HttpStatus.OK).json(academicProfile)
        }catch(err){
            next(err)
        }
    }

    async fetchStudentProfile(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const {userId} = req.params

            const academicStudentProfile = await this._studentAcademicProfileService.fetchStudentProfileByUserId(userId, req.academicYear as string)

            res.status(HttpStatus.OK).json(academicStudentProfile)
        }catch(err){
            next(err)
        }
    }

    async fetchAcademicProfileByClassId(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const {classId} = req.params

            const academicProfiles = await this._studentAcademicProfileService.fetchAcademicProfilesByClassId(classId, req.academicYear as string)

            res.status(HttpStatus.OK).json(academicProfiles)
        }catch(err){
            next(err)
        }
    }
}


