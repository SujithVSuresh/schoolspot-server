import { StudyMaterialEntityType } from "../../types/types";



export interface IStudyMaterialRepository {
    createStudyMaterial(data: StudyMaterialEntityType): Promise<StudyMaterialEntityType>;
}