import { Request, Response,NextFunction } from "express";


export interface IAdminController {
    getAdminProfile(req: Request, res: Response, next: NextFunction): Promise<void>
}