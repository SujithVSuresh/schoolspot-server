import { Request, Response, NextFunction } from "express";
import { CustomRequest, PayloadType } from "../../types/types";
import { IClassController } from "../interface/IClassController";
import IClassService from "../../services/interface/IClassService";
import { AnnouncementDTO, CreateClassDTO, UpdateClassDTO } from "../../dto/ClassDTO";
import HttpStatus from "../../constants/StatusConstants";
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
        name: req.body.name,
        section: req.body.section,
        teacher: req.body.teacher,
        school: String(req.user?.schoolId),
        academicYear: req.academicYear as string
      };

      const newClass = await this._classService.createClass(createClassDTO);

      res.status(HttpStatus.CREATED).json(newClass);
    } catch (err) {
      next(err);
    }
  }


  async updateClass(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {classId} = req.params
      const {schoolId} = req.user as PayloadType

      const updateClass: UpdateClassDTO = {
        name: req.body.name,
        section: req.body.section,
        teacher: req.body.teacher,
        schoolId: schoolId,
        academicYear: req.academicYear as string
      };

      const newClass = await this._classService.updateClass(classId, updateClass);

      res.status(HttpStatus.CREATED).json(newClass);
    } catch (err) {
      next(err);
    }
  }

  async deleteClass(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {classId} = req.params
      console.log(classId, "jajaja")

      const response = await this._classService.deleteClass(classId)

      res.status(HttpStatus.OK).json(response);
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

      const classes = await this._classService.findAllClasses(schoolId, req.academicYear as string);

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

      const response = await this._classService.findClassById(
        classId,
        userId,
        role
      );

      res.status(HttpStatus.OK).json({
        data: response,
      });
    } catch (err) {
      next(err);
    }
  }

  async findClassesByTeacherId(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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

  async addAnnouncement(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { schoolId, userId } = req.user as PayloadType;
      const { title, content, sendTo } = req.body;


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
      const { title, content, sendTo } = req.body;
      const announcementId = req.params.announcementId

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


  async deleteAnnouncement(req: Request, res: Response, next: NextFunction): Promise<void> {
    try{
      const announcementId = req.params.announcementId

      const response = await this._classService.deleteAnnouncement(announcementId)

      res.status(HttpStatus.OK).json(response)

    }catch(err){
      next(err)
    }
  }

  async updatePinnedStatus(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.user as PayloadType;
      const {status} = req.body

      const announcementId = req.params.announcementId

      const response = await this._classService.updatePinnedStatus(announcementId, userId, status)

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async findAnnouncements(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { schoolId } = req.user as PayloadType;

      const classId = req.params.classId

      const response = await this._classService.findAnnouncements(schoolId, classId)

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }


  async findAnnouncementDetails(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try{
      const {userId} = req.user as PayloadType
      const {announcementId} = req.params

      const response = await this._classService.findAnnouncementDetails(announcementId, userId)

      res.status(HttpStatus.OK).json(response)

    }catch(err){
      next(err)
    }
  }

  async findAnnouncementsByAuthor(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try{
      const {userId} = req.user as PayloadType;

      const response = await this._classService.findAnnouncementsByAuthor(userId)

      res.status(HttpStatus.OK).json(response)

    }catch(err){
      next(err)
    }
  }

  async findPinnedAnnouncements(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.user as PayloadType;

      const response = await this._classService.findPinnedAnnouncements(userId)

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }

  async findAnnouncementsByCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { classId, count } = req.params;

      const announcementCount = Number(count);
      
      if (isNaN(announcementCount) || announcementCount <= 0) {
        throw new Error("Invalid count parameter");
      }

      const response = await this._classService.findAnnouncementsByCount(classId, announcementCount);

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
}
