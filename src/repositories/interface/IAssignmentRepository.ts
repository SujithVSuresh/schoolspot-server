import { AssignmentEntityType } from "../../types/types";

export interface IAssignmentRepository {
    createAssignment(data: AssignmentEntityType): Promise<AssignmentEntityType>;
}