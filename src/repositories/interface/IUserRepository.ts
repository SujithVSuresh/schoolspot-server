import { UserType } from "../../types/types";

export interface IUserRepository {
    createUser(user: UserType): Promise<UserType>;
    findByEmail(email: string): Promise<UserType | null>;
    updateUser(id: string, data: Partial<UserType>): Promise<UserType | null>;
    findUserById(id: string): Promise<UserType | null>
    listAllStudents(): Promise<UserType[] | null>
}