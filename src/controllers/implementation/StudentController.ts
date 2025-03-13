import { Request, Response, NextFunction } from "express";
import { IStudentService } from "../../services/interface/IStudentService";
import { IStudentController } from "../interface/IStudentController";
import HttpStatus from "../../constants/StatusConstants";
import { CustomRequest } from "../../types/types";
import { PayloadType } from "../../types/types";



export class StudentController implements IStudentController {
    constructor(private _studentService: IStudentService) {}


    async addStudent(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const {
                fullName,
                class: studentClass,
                section,
                profilePhoto,
                gender,
                dob,
                address,
                fatherName,
                motherName,
                contactNumber,
                email,
                password
              } = req.body;
              

              const {schoolId} = req.user as PayloadType

              const file = req.file

              const student = await this._studentService.addStudent({
                fullName,
                class: studentClass,
                section,
                profilePhoto,
                gender,
                dob,
                address,
                fatherName,
                motherName,
                contactNumber,
                email,
                password
              }, file as  Express.Multer.File, schoolId)

              res.status(HttpStatus.CREATED).json({email: student})
              

        }catch(err){
            next(err)
        }
    }


    async getStudents(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const {schoolId} = req.user as PayloadType

            const students = await this._studentService.getStudents(req.query, schoolId)

            console.log(students, "holo this is the student data..")

              res.status(HttpStatus.OK).json(students)
              
        }catch(err){
            next(err)
        }
    }
}