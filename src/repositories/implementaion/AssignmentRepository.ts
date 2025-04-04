import Assignment from "../../models/Assignment";
import { AssignmentEntityType, AttendaceEntityType } from "../../types/types";
import { IAssignmentRepository } from "../interface/IAssignmentRepository";
import { BaseRepository } from "./BaseRepository";


class AssignmentRepository extends BaseRepository<AssignmentEntityType> implements IAssignmentRepository {
    constructor() {
        super(Assignment);
    }

    async createAssignment(data: AssignmentEntityType): Promise<AssignmentEntityType> {
        try {
            const response = await this.create(data);
            return response;
        } catch (error) {
            console.error("Error creating assignment", error);
            throw new Error("Error creating assignment");
        }
    }
}

export default new AssignmentRepository()