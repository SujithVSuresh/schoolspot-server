import { Request, Response, NextFunction } from "express";
import { IStudentService } from "../../services/interface/IStudentService";
import { IStudentController } from "../interface/IStudentController";
import HttpStatus from "../../constants/StatusConstants";




export class StudentController implements IStudentController {
    constructor(private _studentService: IStudentService) {}


    async addStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
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
              })

              res.status(HttpStatus.CREATED).json({email: student})
              

        }catch(err){
            next(err)
        }
    }


    async getStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{

            console.log("query", req.query)

            const student = this._studentService.getStudents({limit:3, page: 1})

            console.log(student, "holo this is the student data..")

            //   res.status(HttpStatus.OK).json({email: student.email})
              

        }catch(err){
            next(err)
        }
    }
}