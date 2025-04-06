import { Request, Response, NextFunction } from "express";
import { IStudentService } from "../../services/interface/IStudentService";
import { IStudentController } from "../interface/IStudentController";
import HttpStatus from "../../constants/StatusConstants";
import { CustomRequest } from "../../types/types";
import { PayloadType } from "../../types/types";

export class StudentController implements IStudentController {
  constructor(private _studentService: IStudentService) {}

  async addStudent(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        fullName,
        profilePhoto,
        gender,
        dob,
        address,
        fatherName,
        motherName,
        contactNumber,
        email,
        roll,
        password,
        classId,
      } = req.body;

      const { schoolId } = req.user as PayloadType;

      const file = req.file;

      const student = await this._studentService.addStudent(
        {
          fullName,
          roll: roll,
          profilePhoto,
          gender,
          dob,
          address,
          fatherName,
          motherName,
          contactNumber,
          email,
          password,
        },
        file as Express.Multer.File,
        schoolId,
        classId
      );

      res.status(HttpStatus.CREATED).json(student);
    } catch (err) {
      next(err);
    }
  }

  async getStudents(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { schoolId } = req.user as PayloadType;

      const classfilter = req.query.classfilter
        ? decodeURIComponent(req.query.classfilter as string).split(",")
        : [];
      const students = await this._studentService.getStudents(
        { ...req.query, classfilter },
        schoolId
      );

      res.status(HttpStatus.OK).json(students);
    } catch (err) {
      next(err);
    }
  }

  async getStudentProfile(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // const {schoolId} = req.user as PayloadType
      const userId = req.params.userId;

      const students = await this._studentService.getStudentById(userId);

      res.status(HttpStatus.OK).json(students);
    } catch (err) {
      next(err);
    }
  }

  async getStudentByQuery(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const query = req.query;
      const { schoolId } = req.user as PayloadType;

      const students = await this._studentService.getStudentsByQuery(
        query,
        schoolId
      );

      res.status(HttpStatus.OK).json(students);
    } catch (err) {
      next(err);
    }
  }

  async getStudentsByClassId(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const classId = req.params.classId;
      const { schoolId } = req.user as PayloadType;

      console.log(classId, "class", schoolId, "school", req.user)

      const students = await this._studentService.getStudentsByClassId(
        classId as string,
        schoolId
      );

      res.status(HttpStatus.OK).json(students);
    } catch (err) {
      next(err);
    }
  }
}
