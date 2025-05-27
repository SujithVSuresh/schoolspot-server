import { CreateAssignmentDTO, UpdateAssignmentDTO, AssignmentResponseDTO, AssignmentSubmissionsWithAssignmentResponseDTO, UpdateStudyMaterialDTO, AssignmentSubmissionResponseDTO, AssignmentListResponseDTO, CreateStudyMaterialDTO, StudyMaterialResponseDTO, AssignmentSubmissionsListResponseDTO, StudyMaterialResponseWithViewersDTO } from "../../dto/AssignmentDTO"

export interface IAssignmentService{
    createAssignment(data: CreateAssignmentDTO): Promise<AssignmentResponseDTO>
    updateAsssignment(data: UpdateAssignmentDTO, id: string): Promise<AssignmentResponseDTO>
    getAssignments(subjectId: string): Promise<AssignmentListResponseDTO[]> 
    getAssignmentById(assignmentId: string): Promise<AssignmentResponseDTO>
    deleteAssignment(assidnmentId: string): Promise<{_id: string}>
   
    getAllAssignmentSubmissions(assignmentId: string): Promise<AssignmentSubmissionsListResponseDTO[]> 
    addAssignmentSubmission(submissionId: string, data: any): Promise<AssignmentSubmissionResponseDTO | null>
    getAssignmentSubmission(assignmentId: string, userId: string): Promise<AssignmentSubmissionResponseDTO | null>
    getAssignmentSubmissionById(submissionId: string): Promise<AssignmentSubmissionResponseDTO | null>
    getPendingSubmissions(userId: string): Promise<AssignmentSubmissionsWithAssignmentResponseDTO[]>


    createStudyMaterial(data: CreateStudyMaterialDTO, file?: Express.Multer.File): Promise<StudyMaterialResponseDTO> 
    deleteStudyMaterial(id: string): Promise<string>;
    updateStudyMaterial(data: UpdateStudyMaterialDTO, id: string, file?: Express.Multer.File): Promise<StudyMaterialResponseDTO>
    fetchStudyMaterials(subjectId: string): Promise<StudyMaterialResponseDTO[]>    
    fetchStudyMaterialById(id: string): Promise<StudyMaterialResponseWithViewersDTO>
    addStudyMaterialViewer(studyMaterialId: string, studentId: string): Promise<string | null> 
}

export default IAssignmentService