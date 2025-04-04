import { CreateAssignmentDTO, AssignmentResponseDTO } from "../../dto/AssignmentDTO"

export interface IAssignmentService{
    createAssignment(data: CreateAssignmentDTO): Promise<AssignmentResponseDTO>
}
export default IAssignmentService