import { Request, Response, NextFunction } from "express";
import { IExamResultService } from "../../services/interface/IExamResultService";
import { IExamResultController } from "../interface/IExamResultController";
import { CreateExamResultDTO, UpdateExamResultDTO } from "../../dto/ExamResultDTO";
import HttpStatus from "../../constants/StatusConstants";
import Messages from "../../constants/MessageConstants";
import { CustomRequest, PayloadType } from "../../types/types";
import mongoose from "mongoose";


export class ExamResultController implements IExamResultController {
  constructor(private _examResultService: IExamResultService) {}

  async upsertExamResult(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;
      const examResultData: CreateExamResultDTO[] = data.map((item: CreateExamResultDTO) => {
        return {
        classId: new mongoose.Types.ObjectId(item?.classId),
        examId: new mongoose.Types.ObjectId(item?.examId),
        studentId: new mongoose.Types.ObjectId(item?.studentId),
        subject: item?.subject,
        totalMarks: item?.totalMarks,
        marksObtained: item?.marksObtained,
        grade: item?.grade ?? "",
        }
      })


      const response = await this._examResultService.upsertExamResult(
        examResultData
      );

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }


  // async updateExamResult(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //       const {id} = req.params
  //       const data = req.body;
  //       const examResultData: UpdateExamResultDTO = {
  //         totalMarks: data?.totalMarks,
  //         marksObtained: data?.marksObtained,
  //         grade: data?.grade ?? "",
  //       };
  //       const response = await this._examResultService.updateExamResult(
  //           id,
  //         examResultData
  //       );
  
  //       res.status(HttpStatus.OK).json(response);
  //     } catch (err) {
  //       next(err);
  //     } 
  // }

  async deleteExamResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const {id} = req.params

        const response = await this._examResultService.deleteExamResult(id);
  
        res.status(HttpStatus.OK).json(response);
      } catch (err) {
        next(err);
      } 
  }

  async findExamResultsByStudent(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
      const { examId, userId: userIdFromParams } = req.params;
    const { userId: userIdFromToken, role } = req.user as PayloadType;

      const userId = role === "admin" ? userIdFromParams : userIdFromToken;

        const response = await this._examResultService.findExamResultsByStudent(examId, userId)
  
        res.status(HttpStatus.OK).json(response);
      } catch (err) {
        next(err);
      } 
  }


  async findExamResultsBySubject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { examId, subject } = req.params;

        const response = await this._examResultService.findExamResultsBySubject(examId, subject)
  
        res.status(HttpStatus.OK).json(response);
      } catch (err) {
        next(err);
      } 
  }
}
