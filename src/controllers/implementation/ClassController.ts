import { Request, Response, NextFunction } from "express";
import { CustomRequest, PayloadType } from "../../types/types";
import { IClassController } from "../interface/IClassController";
import IClassService from "../../services/interface/IClassService";
import {
  AnnouncementDTO,
  CreateClassDTO,
  SubjectDTO,
} from "../../dto/ClassDTO";
import HttpStatus from "../../constants/StatusConstants";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import mongoose from "mongoose";

export class ClassController implements IClassController {
  constructor(private _classService: IClassService) {}

  async createClass(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const createClassDTO: CreateClassDTO = {
        ...req.body,
        school: req.user?.schoolId,
      };

      const newClass = await this._classService.createClass(createClassDTO);

      res.status(HttpStatus.CREATED).json(newClass);
    } catch (err) {
      next(err);
    }
  }

  async findAllClasses(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { schoolId } = req.user as PayloadType;

      const classes = await this._classService.findAllClasses(schoolId);

      res.status(HttpStatus.CREATED).json({
        data: classes,
      });
    } catch (err) {
      next(err);
    }
  }

  async findClassById(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId, role } = req.user as PayloadType;


      const classId = req.params.classId;


      const response = await this._classService.findClassById(classId, userId, role);

      res.status(HttpStatus.OK).json({
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async findClassesByTeacherId(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.query.teacherId ? req.query.teacherId : req.user?.userId;

      const response = await this._classService.findAllClassesByTeacherId(
        id as string
      );

      res.status(HttpStatus.OK).json({
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async addSubject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, teacher, classId } = req.body;

      const response = await this._classService.addSubject(
        { name, teacher },
        classId
      );

      res.status(HttpStatus.OK).json({
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async removeSubject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { subjectId, classId } = req.query;

      if (!subjectId && !classId) {
        throw new CustomError(
          Messages.SERVER_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const response = await this._classService.removeSubject(
        subjectId as string,
        classId as string
      );

      res.status(HttpStatus.OK).json({
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateSubject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { subjectId, classId } = req.body;

      const data = req.body;

      const subjectData: SubjectDTO = {
        name: data.name,
        teacher: data.teacher,
      };

      if (!subjectId && !classId) {
        throw new CustomError(
          Messages.SERVER_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      const response = await this._classService.updateSubject(
        subjectId as string,
        classId as string,
        subjectData
      );

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async addAnnouncement(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { schoolId, userId } = req.user as PayloadType;
      const { title, content, sendTo } = req.body.announcementData;

      const announcementData: AnnouncementDTO = {
        title,
        content,
        sendTo,
        schoolId: new mongoose.Types.ObjectId(schoolId),
        author: new mongoose.Types.ObjectId(userId),
      };

      const response = await this._classService.addAnnouncement(
        announcementData
      );

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async updateAnnouncement(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { schoolId, userId } = req.user as PayloadType;
      const { title, content, sendTo, announcementId } = req.body;

      const announcementData: AnnouncementDTO = {
        title,
        content,
        sendTo,
        schoolId: new mongoose.Types.ObjectId(schoolId),
        author: new mongoose.Types.ObjectId(userId),
      };

      const response = await this._classService.updateAnnouncement(
        announcementId,
        announcementData
      );

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async fetchAnnouncements(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { schoolId } = req.user as PayloadType;

      const response = await this._classService.fetchAnnouncements(schoolId);

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
}
