import { Request, Response, NextFunction } from "express";
import { CustomRequest, PayloadType } from "../../types/types";
import { IClassController } from "../interface/IClassController";
import IClassService from "../../services/interface/IClassService";
import { CreateClassDTO } from "../../dto/ClassDTO";
import HttpStatus from "../../constants/StatusConstants";


export class ClassController implements IClassController {
    constructor(private _classService: IClassService) {}

    async createClass(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
        const createClassDTO: CreateClassDTO = {
            ...req.body,
            school: req.user?.schoolId
        }

        const newClass = await this._classService.createClass(createClassDTO)

        res.status(HttpStatus.CREATED).json(newClass)
        }catch(err){
            next(err)
        }
    }

    async findAllClasses(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{

            const { schoolId } = req.user as PayloadType
    
            const classes = await this._classService.findAllClasses(schoolId)
    
            res.status(HttpStatus.CREATED).json({
                data: classes 
            })
            }catch(err){
                next(err)
            }
    }
}