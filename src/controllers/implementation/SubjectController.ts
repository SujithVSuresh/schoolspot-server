import { ISubjectController } from "../interface/ISubjectController";
import { ISubjectService } from "../../services/interface/ISubjectService";
import { Request, Response, NextFunction } from "express";
import { CustomRequest, PayloadType } from "../../types/types";
import HttpStatus from "../../constants/StatusConstants";
import { CreateSubjectDTO, UpdateSubjectDTO } from "../../dto/SubjectDTO";

export class SubjectController implements ISubjectController {
  constructor(private _subjectService: ISubjectService) {}

  async createSubject(req: CustomRequest, res: Response, next: NextFunction): Promise<void>{
    try {
      const { name, teacher, class: classId } = req.body;

      const { schoolId } = req.user as PayloadType;

      const subjectData: CreateSubjectDTO = {
        name,
        teacher,
        class: classId,
        school: schoolId,
      }

      const subject = await this._subjectService.createSubject(subjectData);

      res.status(HttpStatus.CREATED).json(subject);
    } catch (err) {
      next(err);
    }
      
  }

  async findSubjectsByClass(req: Request, res: Response, next: NextFunction): Promise<void> {
     try{
        const classId = req.params.classId

        const subjects = await this._subjectService.findSubjectsByClass(classId)

        res.status(HttpStatus.OK).json(subjects);
     }catch(err){
        next(err)
     }
  }

  async updateSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
      try{
        const subjectId = req.params.subjectId
        const classId = req.body.class
        const subjectData: UpdateSubjectDTO = {
            name: req.body.name,
            teacher: req.body.teacher
        }
        console.log(classId, subjectData, subjectId, "kopp")
        const subject = await this._subjectService.updateSubject(subjectId, classId, subjectData)

        res.status(HttpStatus.OK).json(subject)

      }catch(err){
        next(err)
      }
  }

  async findSubjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const subjectId = req.params.subjectId

      console.log(subjectId, "gillgill")

      const subject = await this._subjectService.findSubjectById(subjectId)

      res.status(HttpStatus.OK).json(subject)

    }catch(err){
      next(err)
    }
  }

  async deleteSubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const subjectId = req.params.subjectId

      console.log(subjectId, "da iddd")

      const subject = await this._subjectService.deleteSubject(subjectId)

      res.status(HttpStatus.OK).json(subject)

    }catch(err){
      next(err)
    }
  }

}