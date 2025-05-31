import { ChapterEntityType } from "../../types/ChapterType";


export interface IChapterRepository {
    createChapter(data: ChapterEntityType): Promise<ChapterEntityType>
    updateChapter(chapterId: string, data: Partial<ChapterEntityType>): Promise<ChapterEntityType | null>
    deleteChapter(chapterId: string): Promise<boolean | null>
    findChaptersBySubject(classId: string): Promise<ChapterEntityType[]>
    findChapterById(chapterId: string): Promise<ChapterEntityType | null>
}