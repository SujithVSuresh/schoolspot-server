import { CreateAssignmentDTO, AssignmentResponseDTO, AssignmentSubmissionResponseDTO, AssignmentListResponseDTO, CreateStudyMaterialDTO, StudyMaterialResponseDTO, AssignmentSubmissionsListResponseDTO, StudyMaterialResponseWithViewersDTO } from "../../dto/AssignmentDTO"

export interface IAssignmentService{
    createAssignment(data: CreateAssignmentDTO): Promise<AssignmentResponseDTO>
    getAssignments(subjectId: string): Promise<AssignmentListResponseDTO[]> 
    getAssignmentById(assignmentId: string): Promise<AssignmentResponseDTO>
    getAllAssignmentSubmissions(assignmentId: string): Promise<AssignmentSubmissionsListResponseDTO[]> 
    addAssignmentSubmission(submissionId: string, data: any): Promise<AssignmentSubmissionResponseDTO | null>
    getAssignmentSubmission(assignmentId: string, userId: string): Promise<AssignmentSubmissionResponseDTO | null>
    createStudyMaterial(data: CreateStudyMaterialDTO, file?: Express.Multer.File): Promise<StudyMaterialResponseDTO> 
    fetchStudyMaterials(subjectId: string): Promise<StudyMaterialResponseDTO[]>    
    fetchStudyMaterialById(id: string): Promise<StudyMaterialResponseWithViewersDTO>
    addStudyMaterialViewer(studyMaterialId: string, studentId: string): Promise<string | null> 
    getAssignmentSubmissionById(submissionId: string): Promise<AssignmentSubmissionResponseDTO | null>
}

export default IAssignmentService