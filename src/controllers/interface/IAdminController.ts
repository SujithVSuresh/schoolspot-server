import { Request, Response,NextFunction } from "express";


export interface IAdminController {
    getAdminProfile(req: Request, res: Response, next: NextFunction): Promise<void>
    createAdminProfile(req: Request, res: Response, next: NextFunction): Promise<void> 
    updateAdminProfile(req: Request, res: Response, next: NextFunction): Promise<void>
}