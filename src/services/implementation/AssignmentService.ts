import { CreateAssignmentDTO, AssignmentResponseDTO } from "../../dto/AssignmentDTO";
import { IAssignmentRepository } from "../../repositories/interface/IAssignmentRepository";
import IAssignmentService from "../interface/IAssignmentService";



export class AssignmentService implements IAssignmentService {
  constructor(private _assignmentRepository: IAssignmentRepository) {}

  async createAssignment(data: CreateAssignmentDTO): Promise<AssignmentResponseDTO> {
     
    const response = await this._assignmentRepository.createAssignment(data);

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
}