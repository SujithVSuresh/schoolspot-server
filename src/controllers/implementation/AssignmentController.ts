import { Request, Response, NextFunction } from "express";
import IAssignmentService from "../../services/interface/IAssignmentService";
import { IAssignmentController } from "../interface/IAssignmentController";
import { CreateAssignmentDTO, CreateStudyMaterialDTO, UpdateAssignmentDTO, UpdateStudyMaterialDTO } from "../../dto/AssignmentDTO";
import { CustomRequest } from "../../types/types";
import { PayloadType } from "../../types/types";
import HttpStatus from "../../constants/StatusConstants";


export class AssignmentController implements IAssignmentController {
  constructor(private _assignmentService: IAssignmentService) {}

  async createAssignment(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
      try {

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

  async deleteAssignment(req: Request, res: Response, next: NextFunction): Promise<void> {
      try{
        const assignmentId = req.params.assignmentId

        const response = await this._assignmentService.deleteAssignment(assignmentId)

        res.status(HttpStatus.OK).json(response)

      }catch(err){
        next(err)
      }
  }

  async updateAssignment(req: Request, res: Response, next: NextFunction): Promise<void> {
      try{
        const assignmentId = req.params.assignmentId

        const data: UpdateAssignmentDTO = {
            title: req.body.title,
            description: req.body.description,
            link: req.body.link ? req.body.link : null,
            submissionType: req.body.submissionType,
            dueDate: req.body.dueDate,
        }

        const response = await this._assignmentService.updateAsssignment(data, assignmentId as string)

        res.status(HttpStatus.OK).json({
            message: "Assignment updated successfully",
            data: response
        })

      }catch(err){
        next(err)
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

async createStudyMaterial(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {

        const { schoolId, userId } = req.user as PayloadType;
        const file = req.file;

        const data: CreateStudyMaterialDTO = {
            title: req.body.title,
            description: req.body.description,
            link: req.body.link ? req.body.link : null,
            schoolId: schoolId,
            teacherId: userId,
            classId: req.body.classId,
            subjectId: req.body.subjectId
        }     
        
        const response = await this._assignmentService.createStudyMaterial(data, file);

        res.status(201).json({
            message: "Study material created successfully",
            data: response,
        });

      } catch(err) {
          next(err);
      }
}

async updateStudyMaterial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const studyMaterialId = req.params.studyMaterialId
        const file = req.file

        const data: UpdateStudyMaterialDTO = {
            title: req.body.title,
            description: req.body.description,
            link: req.body.link ? req.body.link : null,
        }  
        
        const response = await this._assignmentService.updateStudyMaterial(data, studyMaterialId, file)

        res.status(HttpStatus.OK).json({
            message: "Study material updated successfully",
            data: response,
        });

    }catch(err){
        next(err)
    }
}

async deleteStudyMaterial(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{

        const studyMaterialId = req.params.studyMaterialId

        const response = await this._assignmentService.deleteStudyMaterial(studyMaterialId)

        res.status(HttpStatus.OK).json({
            message: "Study material deleted successfully",
            data: response
        })

    }catch(err){
        next(err)
    }
}

async fetchStudyMaterials(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

        const { subjectId } = req.params;
        const response = await this._assignmentService.fetchStudyMaterials(subjectId);

        res.status(200).json({
            message: "Study materials fetched successfully",
            data: response,
        });

      } catch(err) {
          next(err);
      }
}

async fetchStudyMaterialById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        const response = await this._assignmentService.fetchStudyMaterialById(id)

        res.status(200).json({
            message: "Study material fetched successfully",
            data: response,
        });

      } catch(err) {
          next(err);
      }
}

async addStudyMaterialView(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
  try {
      const { materialId } = req.params;
      const { userId } = req.user as PayloadType;
      const response = await this._assignmentService.addStudyMaterialViewer(materialId, userId)

      res.status(200).json({
          message: "Study material viewed successfully",
          data: response,
      });

    }catch(err) {
        next(err);
    }
}

async getAssignmentSubmission(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try{
        const { assignmentId } = req.params;
        const { userId } = req.user as PayloadType;
        const response = await this._assignmentService.getAssignmentSubmission(assignmentId, userId)

        res.status(200).json({
            message: "Assignment submission fetched successfully",
            data: response,
        });
    }catch(err){
        next(err)
    }
}

async getAssignmentSubmissionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const { submissionId } = req.params;
        const response = await this._assignmentService.getAssignmentSubmissionById(submissionId)

        res.status(200).json({
            message: "Assignment submission fetched successfully",
            data: response,
        });
    }catch(err){
        next(err)
    } 
}

async addAssignmentSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const { submissionId } = req.params;
        const data = {
            description: req.body.description ? req.body.description : null,
            link: req.body.link ? req.body.link : null,
            fileUrl: req.file ? req.file.path : null,
            status: req.body.description || req.body.link || req.body.fileUrl  ? "Submitted" : "Pending",
            submittedAt: req.body.description || req.body.link || req.body.fileUrl ? new Date() : null
        }

        const response = await this._assignmentService.addAssignmentSubmission(submissionId, data)

        res.status(200).json({
            message: "Assignment submission added successfully",
            data: response,
        });
    }catch(err){
        next(err)
    }
}

async fetchPendingAssignments(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try{
        const { userId } = req.user as PayloadType;
        const response = await this._assignmentService.getPendingSubmissions(userId)

        res.status(200).json({
            message: "Assignment submissions fetched successfully",
            data: response,
        });
    }catch(err){
        next(err)
    }
}

async addMarksToAssignmentSubmission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
        const { submissionId } = req.params;
        const data = {
            grade: req.body.grade,
            feedback: req.body.feedback,
            status: "Graded",
        }

        const response = await this._assignmentService.addAssignmentSubmission(submissionId, data)

        res.status(200).json({
            message: "Marks added successfully",
            data: response,
        });
    }catch(err){
        next(err)
    }
}

}