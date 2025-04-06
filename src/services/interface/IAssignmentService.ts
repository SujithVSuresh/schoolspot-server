import { CreateAssignmentDTO, AssignmentResponseDTO, AssignmentListResponseDTO, AssignmentSubmissionsListResponseDTO } from "../../dto/AssignmentDTO"

export interface IAssignmentService{
    createAssignment(data: CreateAssignmentDTO): Promise<AssignmentResponseDTO>
    getAssignments(subjectId: string): Promise<AssignmentListResponseDTO[]> 
    getAssignmentById(assignmentId: string): Promise<AssignmentResponseDTO>
    getAllAssignmentSubmissions(assignmentId: string): Promise<AssignmentSubmissionsListResponseDTO[]> 
    
}

export default IAssignmentService