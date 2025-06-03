import { Request, Response, NextFunction } from "express";
import { IStudentService } from "../../services/interface/IStudentService";
import { IStudentController } from "../interface/IStudentController";
import HttpStatus from "../../constants/StatusConstants";
import { CustomRequest } from "../../types/types";
import { PayloadType } from "../../types/types";
import {
  CreateStudentDTO,
  StudentSearchQueryDTO,
  UpdateStudentDTO,
} from "../../dto/StudentDTO";

export class StudentController implements IStudentController {
  constructor(private _studentService: IStudentService) {}

  async addStudent(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;

      const { schoolId } = req.user as PayloadType;

      const file = req.file;

      const studentData: CreateStudentDTO = {
        fullName: data.fullName,
        profilePhoto: data.roll,
        gender: data.gender,
        dob: data.dob,
        address: data.address,
        fatherName: data.fatherName,
        motherName: data.motherName,
        parentContactNumber: data.parentContactNumber,
        parentEmailAddress: data.parentEmailAddress,
        admissionNo: data.admissionNo,
        schoolId,
        email: data.email,
        password: data.password,
      };

      const student = await this._studentService.addStudent(
        studentData,
        file as Express.Multer.File,
      );

      res.status(HttpStatus.CREATED).json(student);
    } catch (err) {
      next(err);
    }
  }

  // async updateStudent(
  //   req: CustomRequest,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const data = req.body;

  //     const { studentId } = req.params;

  //     const file = req.file ? req.file : null;

  //     const studentData: UpdateStudentDTO = {
  //       fullName: data.fullName,
  //       roll: data.roll,
  //       profilePhoto: "",
  //       gender: data.gender,
  //       dob: data.dob,
  //       address: data.address,
  //       fatherName: data.fatherName,
  //       motherName: data.motherName,
  //       contactNumber: data.contactNumber,
  //       email: data.email,
  //     };

  //     const student = await this._studentService.updateStudent(
  //       studentData,
  //       studentId,
  //       file as Express.Multer.File
  //     );

  //     res.status(HttpStatus.CREATED).json(student);
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  async getStudents(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { schoolId } = req.user as PayloadType;

      const {
        limit = "5",
        page = "1",
        search = "",
        sortBy = "createdAt",
        sortOrder = "desc",
        statusFilter = "",
      } = req.query;

      const query: StudentSearchQueryDTO = {
        limit: Number(limit),
        page: Number(page),
        search: String(search),
        sortBy: sortBy ? String(sortBy) : "createdAt",
        sortOrder: sortOrder === "asc" ? "asc" : "desc",
        statusFilter:
          statusFilter == "active"
            ? "active"
            : statusFilter == "inactive"
            ? "inactive"
            : statusFilter == "blocked"
            ? "blocked"
            : "",
      };

      console.log("controller...", query);

      const students = await this._studentService.getStudentsBySchool(
        query,
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
      const userId =
        req.user?.role == "student" ? req.user.userId : req.params.userId;

      const students = await this._studentService.getStudentById(userId);

      res.status(HttpStatus.OK).json(students);
    } catch (err) {
      next(err);
    }
  }

  // async getStudentByQuery(
  //   req: CustomRequest,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const query = req.query;
  //     const { schoolId } = req.user as PayloadType;

  //     const students = await this._studentService.getStudentsByQuery(
  //       query,
  //       schoolId
  //     );

  //     res.status(HttpStatus.OK).json(students);
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // async getStudentsByClassId(
  //   req: CustomRequest,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const classId = req.params.classId;
  //     const { schoolId } = req.user as PayloadType;

  //     const students = await this._studentService.getStudentsByClassId(
  //       classId as string,
  //       schoolId
  //     );

  //     res.status(HttpStatus.OK).json(students);
  //   } catch (err) {
  //     next(err);
  //   }
  // }
}
