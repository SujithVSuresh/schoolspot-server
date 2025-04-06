import { AssignmentSubmissionStudentEntityType } from "../../types/types";

export interface IAssignmentSubmissionRepository {
    getAssignmentSubmissions(assignmentId: string): Promise<AssignmentSubmissionStudentEntityType[]>;
}