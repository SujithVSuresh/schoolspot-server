import { Request, Response, NextFunction } from "express";
import IAssignmentService from "../../services/interface/IAssignmentService";
import { IAssignmentController } from "../interface/IAssignmentController";
import { CreateAssignmentDTO } from "../../dto/AssignmentDTO";
import { CustomRequest } from "../../types/types";
import { PayloadType } from "../../types/types";


export class AssignmentController implements IAssignmentController {
  constructor(private _assignmentService: IAssignmentService) {}

  async createAssignment(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
      try {
        const { schoolId, userId } = req.user as PayloadType;

        const data: CreateAssignmentDTO = {
            title: req.body.title,
            description: req.body.description,
            link: req.body.link,
            submissionType: req.body.submissionType,
            dueDate: req.body.dueDate,
            schoolId: schoolId,
            teacherId: userId,
            classId: req.body.classId,
            subjectId: req.body.subjectId
        }     
        
        const response = await this._assignmentService.createAssignment(data);

        res.status(201).json({
            message: "Assignment created successfully",
            data: response,
        });

      } catch(err) {
          next(err);
      }
  }

}