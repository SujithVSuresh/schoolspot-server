import Assignment from "../../models/Assignment";
import AssignmentSubmission from "../../models/AssignmentSubmission";
import { AssignmentEntityType, AssignmentSubmissionEntityType } from "../../types/types";
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

    async updateAssignment(data: Partial<AssignmentEntityType>, id: string): Promise<AssignmentEntityType | null> {
        try{
            const response = await this.update(id, data)
            return response

        }catch(error){
            console.error("Error updating assignment", error);
            throw new Error("Error updating assignment");   
        }
    }

    async getAssignments(subjectId: string): Promise<AssignmentEntityType[]> {
        try {
            const response = await this.findByQuery({subjectId});
            return response;
        } catch (error) {
            console.error("Error fetching assignments", error);
            throw new Error("Error fetching assignments");
        }
    }

    async getAssignmentById(assignmentId: string): Promise<AssignmentEntityType | null> {
        try {
            const response = await this.findById(assignmentId);
            return response;
        } catch (error) {
            console.error("Error fetching assignment by ID", error);
            throw new Error("Error fetching assignment by ID");
        }

    }

    async createAssignmentSubmissions(data: AssignmentSubmissionEntityType[]): Promise<string> {
        try {
            console.log(data, "dddddddddd")
            const response = await AssignmentSubmission.insertMany(data);
            console.log(response, "rrrrsssss")
            return response[0].assignmentId.toString();
        } catch (error) {
            console.error("Error creating assignment submissions", error);
            throw new Error("Error creating assignment submissions");
        }
    }

    async deleteAssignment(id: string): Promise<boolean> {
        try {
            const response = await this.delete(id);
            return response
        } catch (error) {
            console.error("Error deleting assignment submissions", error);
            throw new Error("Error deleting assignment submissions");
        }
    }
}

export default new AssignmentRepository()