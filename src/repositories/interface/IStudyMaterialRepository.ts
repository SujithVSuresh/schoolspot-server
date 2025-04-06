import { StudyMaterialEntityType } from "../../types/types";



export interface IStudyMaterialRepository {
    createStudyMaterial(data: StudyMaterialEntityType): Promise<StudyMaterialEntityType>;
    getStudyMaterial(subjectId: string): Promise<StudyMaterialEntityType[]>;
}