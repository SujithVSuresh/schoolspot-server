import {
  CreateAssignmentDTO,
  AssignmentResponseDTO,
  AssignmentListResponseDTO,
  AssignmentSubmissionsListResponseDTO,
  CreateStudyMaterialDTO,
  StudyMaterialResponseDTO,
  StudyMaterialResponseWithViewersDTO,
  AssignmentSubmissionResponseDTO,
  UpdateStudyMaterialDTO,
  UpdateAssignmentDTO,
  AssignmentSubmissionsWithAssignmentResponseDTO
} from "../../dto/AssignmentDTO";
import { IAssignmentRepository } from "../../repositories/interface/IAssignmentRepository";
import IAssignmentService from "../interface/IAssignmentService";
import { IStudentRepository } from "../../repositories/interface/IStudentRepository";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { IAssignmentSubmissionRepository } from "../../repositories/interface/IAssignmentSubmissionRepository";
import { IStudyMaterialRepository } from "../../repositories/interface/IStudyMaterialRepository";
import cloudinary from "../../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import { INotificationService } from "../interface/INotificationService";
import mongoose from "mongoose";
import { AssignmentEntityType, AssignmentSubmissionEntityType } from "../../types/types";
import { IStudentAcademicProfileRepository } from "../../repositories/interface/IStudentAcademicProfileRepository";


export class AssignmentService implements IAssignmentService {
  constructor(
    private _assignmentRepository: IAssignmentRepository,
    private _studentRepository: IStudentRepository,
    private _assignmentSubmissionRepository: IAssignmentSubmissionRepository,
    private _studyMaterialRepository: IStudyMaterialRepository,
    private _notificationService: INotificationService,
    private _studentAcademicProfileRepository: IStudentAcademicProfileRepository
  ) {}

  async createAssignment(
    data: CreateAssignmentDTO,
    academicYear: string
  ): Promise<AssignmentResponseDTO> {
    if(data.dueDate && new Date(data.dueDate) < new Date()){
      throw new CustomError(
        Messages.DUE_DATE_INVALID,
        HttpStatus.BAD_REQUEST
      );
    }
    const response = await this._assignmentRepository.createAssignment(data);

    // const students = await this._studentRepository.getStudents(
    //   { classId: response.classId },
    //   response.schoolId as string
    // );

    const students = await this._studentAcademicProfileRepository.findAcademicProfilesByClassId(response.classId as string)

    const assignmentSubmissions: AssignmentSubmissionEntityType[] = students.map((student: any) => {
      return {
        assignmentId: new mongoose.Types.ObjectId(response?._id),
        studentId: new mongoose.Types.ObjectId(student?.userId),
        schoolId: new mongoose.Types.ObjectId(response?.schoolId),
        status: "Pending" as "Pending" | "Submitted" | "Graded",
      };
    });


    await this._assignmentRepository.createAssignmentSubmissions(
        assignmentSubmissions 
      );

      const studentIds = students.map((student: any) => {
        return String(student.userId)
    })

     const notifications =  await this._notificationService.sendNotification({
        academicYear,
        notificationType: "assignment",
        message: response.title
      }, studentIds)

      console.log(notifications, "is noty done..")

    //   const socketManager = getSocketManager();

    //  socketManager.emitNotification(["room1"], { text: "Hello from another file!" });

    return {
      _id: String(response._id),
      title: response.title,
      description: response.description,
      link: response.link,
      submissionType: response.submissionType,
      dueDate: response.dueDate,
      createdAt: response.createdAt,
    };
  }

  async getAssignments(
    subjectId: string
  ): Promise<AssignmentListResponseDTO[]> {
    const response = await this._assignmentRepository.getAssignments(subjectId);

    const data: AssignmentListResponseDTO[] = response.map((assignment) => {
      return {
        _id: assignment._id?.toString(),
        title: assignment.title,
        dueDate: assignment.dueDate,
        createdAt: assignment.createdAt,
      };
    });

    return data;
  }

  

  async deleteAssignment(assidnmentId: string): Promise<{_id: string}> {
    const response = await this._assignmentRepository.deleteAssignment(assidnmentId)

    if(!response){
      throw new CustomError(Messages.ASSIGNMENT_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return {
      _id: assidnmentId
    }
  }


  async updateAsssignment(data: UpdateAssignmentDTO, id: string): Promise<AssignmentResponseDTO> {
    const response = await this._assignmentRepository.updateAssignment(data, id)

    if(!response){
      throw new CustomError(Messages.ASSIGNMENT_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return {
      _id: String(response._id),
      title: response.title,
      description: response.description,
      link: response.link,
      submissionType: response.submissionType,
      dueDate: response.dueDate,
      createdAt: response.createdAt,
    };
  }

  async getAssignmentById(
    assignmentId: string
  ): Promise<AssignmentResponseDTO> {
    const assignment = await this._assignmentRepository.getAssignmentById(
      assignmentId
    );

    if (!assignment) {
      throw new CustomError(
        Messages.ASSIGNMENT_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return {
      _id: String(assignment._id),
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      createdAt: assignment.createdAt,
      submissionType: assignment.submissionType,
      link: assignment.link ? assignment.link : "",
    };
  }

  async getAllAssignmentSubmissions(
    assignmentId: string
  ): Promise<AssignmentSubmissionsListResponseDTO[]> {
    const response =
      await this._assignmentSubmissionRepository.getAssignmentSubmissions(
        assignmentId
      );

    const assignmentSubmission: AssignmentSubmissionsListResponseDTO[] =
      response.map((submission) => ({
        _id: submission._id?.toString() ?? "",
        assignmentId: submission.assignmentId.toString(),
        status: submission.status,
        submittedAt: submission.submittedAt ?? null,
        student: {
          _id: submission.student._id.toString(),
          fullName: submission.student.fullName,
          class: submission.student.class,
          section: submission.student.section,
          roll: submission.student.roll,
        },
      }));

    return assignmentSubmission;
  }

  async getAssignmentSubmission(
    assignmentId: string,
    userId: string
  ): Promise<AssignmentSubmissionResponseDTO | null> {
    const response =
      await this._assignmentSubmissionRepository.getAssignmentSubmission(
        assignmentId,
        userId
      );

    if (!response) {
      throw new CustomError(
        Messages.ASSIGNMENT_SUBMISSION_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    const assignmentSubmission: AssignmentSubmissionResponseDTO = {
      _id: String(response._id),
      assignmentId: response.assignmentId.toString(),
      description: response.description ? response.description : "",
      link: response.link ? response.link : "",
      fileUrl: response.fileUrl ? response.fileUrl : "",
      grade: response.grade ? response.grade : "",
      feedback: response.feedback ? response.feedback : "",
      status: response.status,
      createdAt: response.createdAt,
      submittedAt: response.submittedAt ?? null,
    };

    return assignmentSubmission;
  }

  async getAssignmentSubmissionById(
    submissionId: string
  ): Promise<AssignmentSubmissionResponseDTO | null> {
    const response =
      await this._assignmentSubmissionRepository.getAssignmentSubmissionById(
        submissionId
      );

    if (!response) {
      throw new CustomError(
        Messages.ASSIGNMENT_SUBMISSION_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    const assignmentSubmission: AssignmentSubmissionResponseDTO = {
      _id: String(response._id),
      assignmentId: response.assignmentId.toString(),
      description: response.description ? response.description : "",
      link: response.link ? response.link : "",
      fileUrl: response.fileUrl ? response.fileUrl : "",
      grade: response.grade ? response.grade : "",
      feedback: response.feedback ? response.feedback : "",
      status: response.status,
      createdAt: response.createdAt,
      submittedAt: response.submittedAt ?? null,
      student: {
        _id: response.student._id.toString(),
        fullName: response.student.fullName,
        class: response.student.class,
        section: response.student.section,
        roll: response.student.roll,
      },
    };

    return assignmentSubmission;
  }

  async addAssignmentSubmission(
    submissionId: string,
    data: any
  ): Promise<AssignmentSubmissionResponseDTO | null> {

    const response =
      await this._assignmentSubmissionRepository.addAssignmentSubmission(
        submissionId,
        data
      );

    if (!response) {
      throw new CustomError(
        Messages.ASSIGNMENT_SUBMISSION_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    const assignmentSubmission: AssignmentSubmissionResponseDTO = {
      _id: String(response._id),
      assignmentId: response.assignmentId.toString(),
      description: response.description ? response.description : "",
      link: response.link ? response.link : "",
      fileUrl: response.fileUrl ? response.fileUrl : "",
      grade: response.grade ? response.grade : "",
      feedback: response.feedback ? response.feedback : "",
      status: response.status,
      createdAt: response.createdAt,
      submittedAt: response.submittedAt ?? null,
    };

    return assignmentSubmission;
  }


  async getPendingSubmissions(userId: string): Promise<AssignmentSubmissionsWithAssignmentResponseDTO[]> {
    const response = await this._assignmentSubmissionRepository.fetchPendingSubmissions(userId)

    const pendingSubmissions: AssignmentSubmissionsWithAssignmentResponseDTO[] =
      response.map((submission) => {
        const assignmentId = submission.assignmentId as AssignmentEntityType
        return ({
        _id: submission._id?.toString() ?? "",
        assignmentId: {
          _id: assignmentId._id?.toString() ?? "",
          title: assignmentId.title,
          description: assignmentId.description,
          dueDate: assignmentId.dueDate,
          createdAt: assignmentId.createdAt,
        },
        status: submission.status,
      })
      });

    return pendingSubmissions;
  }

  async createStudyMaterial(
    data: CreateStudyMaterialDTO,
    academicYear: string,
    file?: Express.Multer.File
  ): Promise<StudyMaterialResponseDTO> {
    let fileUrl = null;

    if (file) {
      console.log("Uploading file to Cloudinary...");

      const originalName = file.originalname;
      const fileNameWithoutExt = originalName.split(".").slice(0, -1).join(".");

      const uploadResult: UploadApiResponse = await new Promise(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "study_material",
              resource_type: "raw",
              // Don't add .pdf extension to the public_id, Cloudinary will handle it
              public_id: `${fileNameWithoutExt}_${Date.now()}.pdf`,
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary error:", error);
                reject(error);
              } else if (result) {
                console.log("Upload succeeded, result:", result);
                resolve(result);
              } else {
                reject(new Error("Cloudinary upload failed"));
              }
            }
          );
          stream.end(file.buffer);
        }
      );

      fileUrl = uploadResult.secure_url;
    }

    if (fileUrl) {
      data.fileUrl = fileUrl;
    }

    const response = await this._studyMaterialRepository.createStudyMaterial(
      data
    );

    const students = await this._studentRepository.getStudents({
      classId: new mongoose.Types.ObjectId(data.classId)
    }, data.schoolId)

    const studentIds = students.map((student: any) => student.user._id)

    await this._notificationService.sendNotification({
      academicYear,
      notificationType: "study_material",
      message: response.title
    }, studentIds)

    return {
      title: response.title,
      description: response.description,
      createdAt: response.createdAt as Date,
      fileUrl: response.fileUrl ? response.fileUrl : "",
      link: response.fileUrl ? response.fileUrl : "",
    };
  }

  async updateStudyMaterial(
    data: UpdateStudyMaterialDTO,
    id: string,
    file?: Express.Multer.File
  ): Promise<StudyMaterialResponseDTO> {
    let fileUrl = null;

    if (file) {
      console.log("Uploading file to Cloudinary...");

      const originalName = file.originalname;
      const fileNameWithoutExt = originalName.split(".").slice(0, -1).join(".");

      const uploadResult: UploadApiResponse = await new Promise(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "study_material",
              resource_type: "raw",
              // Don't add .pdf extension to the public_id, Cloudinary will handle it
              public_id: `${fileNameWithoutExt}_${Date.now()}.pdf`,
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary error:", error);
                reject(error);
              } else if (result) {
                console.log("Upload succeeded, result:", result);
                resolve(result);
              } else {
                reject(new Error("Cloudinary upload failed"));
              }
            }
          );
          stream.end(file.buffer);
        }
      );

      fileUrl = uploadResult.secure_url;
    }

    if (fileUrl) {
      data.fileUrl = fileUrl;
    }

    const response = await this._studyMaterialRepository.updateStudyMaterial(
      data,
      id
    );
    if (!response) {
      throw new CustomError(
        Messages.STUDY_MATERIAL_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return {
      title: response.title,
      description: response.description,
      createdAt: response.createdAt as Date,
      fileUrl: response.fileUrl ? response.fileUrl : "",
      link: response.fileUrl ? response.fileUrl : "",
    };
  }

  async deleteStudyMaterial(id: string): Promise<string> {
    const response = await this._studyMaterialRepository.deleteStudyMaterial(id)

    if(!response){
      throw new CustomError(Messages.STUDY_MATERIAL_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return id
  }

  async fetchStudyMaterials(
    subjectId: string
  ): Promise<StudyMaterialResponseDTO[]> {
    const response = await this._studyMaterialRepository.getStudyMaterials(
      subjectId
    );

    const data: StudyMaterialResponseDTO[] = response.map((material) => {
      return {
        _id: String(material._id),
        title: material.title,
        description: material.description,
        createdAt: material.createdAt as Date,
        fileUrl: material.fileUrl ? material.fileUrl : "",
        link: material.link ? material.link : "",
      };
    });

    return data;
  }

  async fetchStudyMaterialById(
    id: string
  ): Promise<StudyMaterialResponseWithViewersDTO> {
    const response = await this._studyMaterialRepository.getStudyMaterialById(
      id
    );

    if (!response) {
      throw new CustomError(
        Messages.STUDY_MATERIAL_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    const viewers: { _id: string; fullName: string }[] = (
      response.viewers ?? []
    ).map((user) => ({
      _id: String(user._id),
      fullName: user.fullName,
    }));

    const data: StudyMaterialResponseWithViewersDTO = {
      _id: String(response._id),
      title: response.title,
      description: response.description,
      createdAt: response.createdAt as Date,
      fileUrl: response.fileUrl ? response.fileUrl : "",
      link: response.link ? response.link : "",
      viewers: viewers,
    };

    return data;
  }

  async addStudyMaterialViewer(
    studyMaterialId: string,
    studentId: string
  ): Promise<string | null> {
    const response = await this._studyMaterialRepository.addStudyMaterialViewer(
      studyMaterialId,
      studentId
    );

    return response;
  }
}
