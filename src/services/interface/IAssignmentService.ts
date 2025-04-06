import { CreateAssignmentDTO, AssignmentResponseDTO, AssignmentListResponseDTO, CreateStudyMaterialDTO, StudyMaterialResponseDTO, AssignmentSubmissionsListResponseDTO } from "../../dto/AssignmentDTO"

export interface IAssignmentService{
    createAssignment(data: CreateAssignmentDTO): Promise<AssignmentResponseDTO>
    getAssignments(subjectId: string): Promise<AssignmentListResponseDTO[]> 
    getAssignmentById(assignmentId: string): Promise<AssignmentResponseDTO>
    getAllAssignmentSubmissions(assignmentId: string): Promise<AssignmentSubmissionsListResponseDTO[]> 
    createStudyMaterial(data: CreateStudyMaterialDTO, file?: Express.Multer.File): Promise<StudyMaterialResponseDTO> 
    fetchStudyMaterials(subjectId: string): Promise<StudyMaterialResponseDTO[]>    
}

export default IAssignmentService