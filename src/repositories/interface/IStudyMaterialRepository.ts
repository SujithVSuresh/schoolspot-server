import { StudyMaterialEntityType } from "../../types/types";



export interface IStudyMaterialRepository {
    createStudyMaterial(data: StudyMaterialEntityType): Promise<StudyMaterialEntityType>;
    getStudyMaterials(subjectId: string): Promise<StudyMaterialEntityType[]>;
    getStudyMaterialById(id: string): Promise<StudyMaterialEntityType | null>
    addStudyMaterialViewer(studyMaterialId: string, studentId: string): Promise<string | null> 

}