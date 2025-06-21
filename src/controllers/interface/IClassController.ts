import { Request, Response,NextFunction } from "express";


export interface IClassController {
    createClass(req: Request, res: Response, next: NextFunction): Promise<void>
    updateClass(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteClass(req: Request, res: Response, next: NextFunction): Promise<void>
    findAllClasses(req: Request, res: Response, next: NextFunction): Promise<void>
    findClassById(req: Request, res: Response, next: NextFunction): Promise<void>
    findClassesByTeacherId(req: Request, res: Response, next: NextFunction): Promise<void>   
    
    addAnnouncement(req: Request, res: Response, next: NextFunction): Promise<void>
    updateAnnouncement(req: Request, res: Response, next: NextFunction): Promise<void>
    updatePinnedStatus(req: Request, res: Response, next: NextFunction): Promise<void>
    deleteAnnouncement(req: Request, res: Response, next: NextFunction): Promise<void>
    findAnnouncements(req: Request, res: Response, next: NextFunction): Promise<void>
    findAnnouncementsByAuthor(req: Request, res: Response, next: NextFunction): Promise<void>
    findAnnouncementDetails(req: Request, res: Response, next: NextFunction): Promise<void>
    findPinnedAnnouncements(req: Request, res: Response, next: NextFunction): Promise<void>
    findAnnouncementsByCount(req: Request, res: Response, next: NextFunction): Promise<void>
}