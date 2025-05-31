import { ChapterResponseDTO, CreateChapterDTO, UpdateChapterDTO } from "../../dto/ChapterDTO";


export interface IChapterService {
    createChapter(data: CreateChapterDTO): Promise<ChapterResponseDTO>
    updateChapter(chapterId: string, data: UpdateChapterDTO): Promise<ChapterResponseDTO>
    deleteChapter(chapterId: string): Promise<{_id: string}>
    findChaptersBySubject(subjectId: string): Promise<ChapterResponseDTO[]>
    findChapterById(chapterId: string): Promise<ChapterResponseDTO>
}