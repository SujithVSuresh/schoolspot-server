import { AssignmentEntityType, AssignmentSubmissionEntityType } from "../../types/types";

export interface IAssignmentRepository {
    createAssignment(data: AssignmentEntityType): Promise<AssignmentEntityType>;
    updateAssignment(data: Partial<AssignmentEntityType>, id: string): Promise<AssignmentEntityType | null>
    getAssignments(subjectId: string): Promise<AssignmentEntityType[]>
    getAssignmentById(assignmentId: string): Promise<AssignmentEntityType | null> 
    createAssignmentSubmissions(data: AssignmentSubmissionEntityType[]): Promise<string>;
}