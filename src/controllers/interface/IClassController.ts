import { Request, Response,NextFunction } from "express";


export interface IClassController {
    createClass(req: Request, res: Response, next: NextFunction): Promise<void>
    findAllClasses(req: Request, res: Response, next: NextFunction): Promise<void>
    findClassById(req: Request, res: Response, next: NextFunction): Promise<void>
    findClassesByTeacherId(req: Request, res: Response, next: NextFunction): Promise<void>
   
    addAnnouncement(req: Request, res: Response, next: NextFunction): Promise<void>
    updateAnnouncement(req: Request, res: Response, next: NextFunction): Promise<void>
    fetchAnnouncements(req: Request, res: Response, next: NextFunction): Promise<void>
    findAnnouncements(req: Request, res: Response, next: NextFunction): Promise<void>
}