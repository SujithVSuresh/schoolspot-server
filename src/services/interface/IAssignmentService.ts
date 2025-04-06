import { CreateAssignmentDTO, AssignmentResponseDTO, AssignmentListResponseDTO } from "../../dto/AssignmentDTO"

export interface IAssignmentService{
    createAssignment(data: CreateAssignmentDTO): Promise<AssignmentResponseDTO>
    getAssignments(subjectId: string): Promise<AssignmentListResponseDTO[]> 
    getAssignmentById(assignmentId: string): Promise<AssignmentResponseDTO>
}

export default IAssignmentService