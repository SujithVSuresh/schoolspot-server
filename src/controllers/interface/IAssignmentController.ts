import { NextFunction, Request, Response } from "express"

export interface IAssignmentController {
    createAssignment(req: Request, res: Response, next: NextFunction): Promise<void>
    updateAssignment(req: Request, res: Response, next: NextFunction): Promise<void>
    getAssignments(req: Request, res: Response, next: NextFunction): Promise<void>
    getAssignmentById(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteAssignment(req: Request, res: Response, next: NextFunction): Promise<void>

    getAllAssignmentSubmissions(req: Request, res: Response, next: NextFunction): Promise<void>
    getAssignmentSubmission(req: Request, res: Response, next: NextFunction): Promise<void>
    getAssignmentSubmissionById(req: Request, res: Response, next: NextFunction): Promise<void>
    addAssignmentSubmission(req: Request, res: Response, next: NextFunction): Promise<void>
    addMarksToAssignmentSubmission(req: Request, res: Response, next: NextFunction): Promise<void>
    
    createStudyMaterial(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteStudyMaterial(req: Request, res: Response, next: NextFunction): Promise<void>
    updateStudyMaterial(req: Request, res: Response, next: NextFunction): Promise<void>
    fetchStudyMaterials(req: Request, res: Response, next: NextFunction): Promise<void>
    fetchStudyMaterialById(req: Request, res: Response, next: NextFunction): Promise<void>
}