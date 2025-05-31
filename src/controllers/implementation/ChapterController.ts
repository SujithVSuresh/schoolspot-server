import { Request, Response, NextFunction } from "express";
import { IChapterService } from "../../services/interface/IChapterService";
import { IChapterController } from "../interface/IChapterController";
import { CreateChapterDTO, UpdateChapterDTO } from "../../dto/ChapterDTO";
import HttpStatus from "../../constants/StatusConstants";
import { CustomRequest, PayloadType } from "../../types/types";


export class ChapterController implements IChapterController {
    constructor(
        private _chapterService: IChapterService
    ){}

    async createChapter(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try{
            const chapterData = req.body
            const {schoolId} = req.user as PayloadType
            console.log(chapterData, "chapter data.....")

            const data: CreateChapterDTO = {
                title: chapterData.title,
                description: chapterData.description,
                number: chapterData.number,
                school: schoolId,
                subject: chapterData.subject,
                classGrade: chapterData.classGrade
            }

            const response = await this._chapterService.createChapter(data) 

            res.status(HttpStatus.CREATED).json(response)
        }catch(err){
            next(err)
        }
    }

    async updateChapter(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const chapterData = req.body
            const {chapterId} = req.params

            const data: UpdateChapterDTO = {
                title: chapterData.title,
                description: chapterData.description,
                number: chapterData.number
            }

            const response = await this._chapterService.updateChapter(chapterId, data) 

            res.status(HttpStatus.OK).json(response)
        }catch(err){
            next(err)
        }
    }

    async deleteChapter(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {chapterId} = req.params

            const response = await this._chapterService.deleteChapter(chapterId) 

            res.status(HttpStatus.OK).json(response)
        }catch(err){
            next(err)
        }
    }

    async fetchChapterBySubject(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const {subjectId} = req.params

            const response = await this._chapterService.findChaptersBySubject(subjectId)

            res.status(HttpStatus.OK).json(response)
        }catch(err){
            next(err)
        }
    }


    async findChapterById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            console.log("hahahaaaaaaaaaahaaaaaaaaaa")
            const {chapterId} = req.params

            console.log(chapterId, "chhhhhh1111111111111111111222222222222222222222")

            const response = await this._chapterService.findChapterById(chapterId)

            res.status(HttpStatus.OK).json(response)
        }catch(err){
            next(err)
        }
    }
}