import { AssignmentEntityType, AssignmentSubmissionEntityType } from "../../types/types";

export interface IAssignmentRepository {
    createAssignment(data: AssignmentEntityType): Promise<AssignmentEntityType>;
    getAssignments(subjectId: string): Promise<AssignmentEntityType[]>
    getAssignmentById(assignmentId: string): Promise<AssignmentEntityType | null> 
    createAssignmentSubmissions(data: AssignmentSubmissionEntityType[]): Promise<string>;
}