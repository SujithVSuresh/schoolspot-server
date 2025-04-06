import { CreateAssignmentDTO, AssignmentResponseDTO, AssignmentListResponseDTO, AssignmentSubmissionsListResponseDTO } from "../../dto/AssignmentDTO";
import { IAssignmentRepository } from "../../repositories/interface/IAssignmentRepository";
import IAssignmentService from "../interface/IAssignmentService";
import { IStudentRepository } from "../../repositories/interface/IStudentRepository";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { IAssignmentSubmissionRepository } from "../../repositories/interface/IAssignmentSubmissionRepository";


export class AssignmentService implements IAssignmentService {
  constructor(
    private _assignmentRepository: IAssignmentRepository,
    private _studentRepository: IStudentRepository,
    private _assignmentSubmissionRepository: IAssignmentSubmissionRepository
  ) {}

  async createAssignment(data: CreateAssignmentDTO): Promise<AssignmentResponseDTO> {
     
    const response = await this._assignmentRepository.createAssignment(data);

    const students = await this._studentRepository.getStudentsByQuery({classId: response.classId}, response.schoolId as string)

    const assignmentSubmissions = students.map((student: any) => {
      return {
        assignmentId: response._id,
        studentId: student._id,
        schoolId: response.schoolId,
        status: "Pending"
      }
    })
    
    await this._assignmentRepository.createAssignmentSubmissions(assignmentSubmissions)


    return {
        _id: String(response._id),
        title: response.title,
        description: response.description,
        link: response.link,
        submissionType: response.submissionType,
        dueDate: response.dueDate,
        createdAt: response.createdAt,
    }
  }

  async getAssignments(subjectId: string): Promise<AssignmentListResponseDTO[]> {
    const response = await this._assignmentRepository.getAssignments(subjectId);

    const data: AssignmentListResponseDTO[] = response.map((assignment) => {
        return {
            _id: assignment._id?.toString(),
            title: assignment.title,
            dueDate: assignment.dueDate,
            createdAt: assignment.createdAt
        }
    })

    return data
  }

  async getAssignmentById(assignmentId: string): Promise<AssignmentResponseDTO> {
    const assignment = await this._assignmentRepository.getAssignmentById(assignmentId)

    if(!assignment){
      throw new CustomError(Messages.ASSIGNMENT_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return {
      _id: String(assignment._id),
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      createdAt: assignment.createdAt,
      submissionType: assignment.submissionType,
      link: assignment.link ? assignment.link : ""
    }
  }

  async getAllAssignmentSubmissions(assignmentId: string): Promise<AssignmentSubmissionsListResponseDTO[]> {
    const response = await this._assignmentSubmissionRepository.getAssignmentSubmissions(assignmentId)

    const assignmentSubmission: AssignmentSubmissionsListResponseDTO[] = response.map((submission) => ({
      _id: submission._id?.toString() ?? "",
      assignmentId: submission.assignmentId.toString(),
      status: submission.status,
      submittedAt: submission.submittedAt ?? null,
      student: {
        _id: submission.student._id.toString(),
        fullName: submission.student.fullName,
        class: submission.student.class,
        section: submission.student.section,
        roll: submission.student.roll
      }
    }));
    
    

    return assignmentSubmission
  } 
}