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

        console.log("req.body...", req.body)
        const { schoolId, userId } = req.user as PayloadType;

        const data: CreateAssignmentDTO = {
            title: req.body.title,
            description: req.body.description,
            link: req.body.link ? req.body.link : null,
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

  async getAssignments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { subjectId } = req.params;
            const response = await this._assignmentService.getAssignments(subjectId);
    
            res.status(200).json({
                message: "Assignments fetched successfully",
                data: response,
            });
        } catch(err) {
            next(err);
        }
  }

  async getAssignmentById(req: Request, res: Response, next: NextFunction): Promise<void> {
      try{
        const {assignmentId} = req.params;
        const response = await this._assignmentService.getAssignmentById(assignmentId)

        res.status(200).json({
            message: "Assignment fetched successfully",
            data: response
        })
      
    } catch(err) {
        next(err);
    }
}

async getAllAssignmentSubmissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const {assignmentId} = req.params;
        const response = await this._assignmentService.getAllAssignmentSubmissions(assignmentId)

        res.status(200).json({
            message: "Assignment fetched successfully",
            data: response
        })

    }catch(err){
        next(err)
    }
}
  

}