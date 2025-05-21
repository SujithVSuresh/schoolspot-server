import { BaseRepository } from "./BaseRepository";
import { IUserRepository } from "../interface/IUserRepository";
import User from "../../models/User";
import { UserEntityType } from "../../types/UserType";


class UserRepository extends BaseRepository<UserEntityType> implements IUserRepository {
    constructor(){
        super(User)
    }

    async createUser(data: Partial<UserEntityType>): Promise<UserEntityType> {
        try{
            return await this.create(data)
        }catch(error){
            console.error("Error creating user", error);
            throw new Error("Error creating user")
        }
    }             

    async findByEmail(email: string): Promise<UserEntityType | null> {
        try{
            return await this.findOne({email})
        }catch(error){
            console.log("Error finding user with email", error)
            throw new Error("Error finding user with email")
        }
    }

    async updateUser(id: string, data: Partial<UserEntityType>): Promise<UserEntityType | null> {
        try{
            return await this.update(id, data)
        } catch(error){
            console.error("Error updating user", error);
            throw new Error("Error updating user")
        }
    }

    async findUserById(id: string): Promise<UserEntityType | null>{
        try{
            return await this.findById(id)
        } catch(error){
            console.error("Error updating user", error);
            throw new Error("Error updating user")
        }
    }


    async listAllStudents(): Promise<UserEntityType[]> {
        try {
          return await this.findByQuery({role: "student"}, {password: 0});
        } catch (err) {
          console.log("Error updating student profile");
          throw new Error("Error updating student profile");
        }
    }
}

export default new UserRepository()