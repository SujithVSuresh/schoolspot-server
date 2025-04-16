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
      console.log(name, teacher, classId, "name teacher classId..")

      const { schoolId } = req.user as PayloadType;
      console.log(schoolId, "schoolId..")

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
        const subjectData: UpdateSubjectDTO = {
            name: req.body.name,
            teacher: req.body.teacher
        }

        const subject = await this._subjectService.updateSubject(subjectId, req.body.class, subjectData)

        res.status(HttpStatus.OK).json(subject)

      }catch(err){
        next(err)
      }
  }

}