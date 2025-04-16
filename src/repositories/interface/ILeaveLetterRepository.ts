import { LeaveLetterEntityType } from "../../types/types";



export interface ILeaveLetterRepository {
    createLeaveLetter(data: LeaveLetterEntityType): Promise<LeaveLetterEntityType>;
    editLeaveLetter(id: string, data: LeaveLetterEntityType): Promise<LeaveLetterEntityType | null> 
    deleteLeaveLetter(id: string): Promise<string | null>
    findLeaveLetterByQuery(query: any): Promise<LeaveLetterEntityType[]> 
}