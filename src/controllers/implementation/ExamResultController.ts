import { Request, Response, NextFunction } from "express";
import { IExamResultService } from "../../services/interface/IExamResultService";
import { IExamResultController } from "../interface/IExamResultController";
import { CreateExamResultDTO, UpdateExamResultDTO } from "../../dto/ExamResultDTO";
import HttpStatus from "../../constants/StatusConstants";
import Messages from "../../constants/MessageConstants";

export class ExamResultController implements IExamResultController {
  constructor(private _examResultService: IExamResultService) {}

  async createExamResult(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;
      const examResultData: CreateExamResultDTO = {
        classId: data?.classId,
        examId: data?.examId,
        studentId: data?.studentId,
        subjectId: data?.subjectId,
        totalMarks: data?.totalMarks,
        marksObtained: data?.marksObtained,
        grade: data?.grade ?? "",
      };
      const response = await this._examResultService.createExamResult(
        examResultData
      );

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }


  async updateExamResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {id} = req.params
        const data = req.body;
        const examResultData: UpdateExamResultDTO = {
          totalMarks: data?.totalMarks,
          marksObtained: data?.marksObtained,
          grade: data?.grade ?? "",
        };
        const response = await this._examResultService.updateExamResult(
            id,
          examResultData
        );
  
        res.status(HttpStatus.OK).json(response);
      } catch (err) {
        next(err);
      } 
  }

  async deleteExamResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {id} = req.params

        const response = await this._examResultService.deleteExamResult(id);
  
        res.status(HttpStatus.OK).json(response);
      } catch (err) {
        next(err);
      } 
  }
}
