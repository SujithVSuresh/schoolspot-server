import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { CreateChapterDTO, ChapterResponseDTO, UpdateChapterDTO } from "../../dto/ChapterDTO";
import { IChapterRepository } from "../../repositories/interface/IChapterRepository";
import { CustomError } from "../../utils/CustomError";
import { IChapterService } from "../interface/IChapterService";



export class ChapterService implements IChapterService {
    constructor(
        private _chapterRepository: IChapterRepository
    ){}

    async createChapter(data: CreateChapterDTO): Promise<ChapterResponseDTO> {
        const response = await this._chapterRepository.createChapter(data)

        return {
            _id: String(response._id),
            title: response.title,
            number: response.number,
            description: response.description,
            subject: String(response.subject),
            classGrade: String(response.classGrade),
            school: String(response.school)
        }
    }

    async updateChapter(chapterId: string, data: UpdateChapterDTO): Promise<ChapterResponseDTO> {
        const response = await this._chapterRepository.updateChapter(chapterId, data)

        if(!response){
            throw new CustomError(Messages.CHAPTER_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: String(response._id),
            classGrade: String(response.classGrade),
            number: response.number,
            school: String(response.school),
            subject: String(response.subject),
            title: response.title,
            description: response.description
        }
    }

    async deleteChapter(chapterId: string): Promise<{ _id: string; }> {
        const response = await this._chapterRepository.deleteChapter(chapterId)

        if(!response){
            throw new CustomError(Messages.CHAPTER_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: chapterId
        }
    }

    async findChaptersBySubject(subjectId: string): Promise<ChapterResponseDTO[]> {
        const response = await this._chapterRepository.findChaptersBySubject(subjectId)

        const chapters: ChapterResponseDTO[] = response.map((chapter) => {
            return {
                _id: String(chapter._id),
                classGrade: String(chapter.classGrade),
                number: chapter.number,
                school: String(chapter.school),
                subject: String(chapter.subject),
                title: chapter.title,
                description: chapter.description
            }
        })

        return chapters
    }

    async findChapterById(chapterId: string): Promise<ChapterResponseDTO> {
        const response = await this._chapterRepository.findChapterById(chapterId)

        if(!response){
            throw new CustomError(Messages.CHAPTER_NOT_FOUND, HttpStatus.NOT_FOUND)
        }

        return {
            _id: String(response._id),
            classGrade: String(response.classGrade),
            number: response.number,
            school: String(response.school),
            subject: String(response.subject),
            title: response.title,
            description: response.description
        }
    }

}
