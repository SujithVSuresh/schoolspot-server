import { AssignmentSubmissionStudentEntityType, AssignmentSubmissionEntityType } from "../../types/types";

export interface IAssignmentSubmissionRepository {
    getAssignmentSubmissions(assignmentId: string): Promise<AssignmentSubmissionStudentEntityType[]>;
    getAssignmentSubmission(assignmentId: string, userId: string): Promise<AssignmentSubmissionStudentEntityType | null>;
    addAssignmentSubmission(submissionId: string, data: any): Promise<AssignmentSubmissionEntityType  | null> 
    getAssignmentSubmissionById(submissionId: string): Promise<AssignmentSubmissionStudentEntityType | null> 
    fetchPendingSubmissions(userId: string): Promise<AssignmentSubmissionEntityType[]>

}