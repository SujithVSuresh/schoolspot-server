import { UserEntityType } from "../../types/UserType";

export interface IUserRepository {
    createUser(user: UserEntityType): Promise<UserEntityType>;
    findByEmail(email: string): Promise<UserEntityType | null>;
    updateUser(id: string, data: Partial<UserEntityType>): Promise<UserEntityType | null>;
    findUserById(id: string): Promise<UserEntityType | null>
    listAllStudents(): Promise<UserEntityType[]>
}