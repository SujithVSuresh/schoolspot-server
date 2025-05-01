import { LeaveLetterEntityType } from "../../types/types";



export interface ILeaveLetterRepository {
    createLeaveLetter(data: LeaveLetterEntityType): Promise<LeaveLetterEntityType>;
    editLeaveLetter(id: string, data: Partial<LeaveLetterEntityType>): Promise<LeaveLetterEntityType | null> 
    deleteLeaveLetter(id: string): Promise<boolean | null>
    findLeaveLetters(query: any): Promise<LeaveLetterEntityType[]> 
    findLeaveLetterById(id: string): Promise<LeaveLetterEntityType | null>
}