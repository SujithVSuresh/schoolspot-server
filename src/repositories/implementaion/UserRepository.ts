import { BaseRepository } from "./BaseRepository";
import { UserType } from "../../types/types";
import { IUserRepository } from "../interface/IUserRepository";
import User from "../../models/User";


class UserRepository extends BaseRepository<UserType> implements IUserRepository {
    constructor(){
        super(User)
    }

    async createUser(data: Partial<UserType>): Promise<UserType> {
        try{
            return await this.create(data)
        }catch(error){
            console.error("Error creating user", error);
            throw new Error("Error creating user")
        }
    }

    async findByEmail(email: string): Promise<UserType | null> {
        try{
            return await this.findOne({email})
        }catch(error){
            console.log("Error finding user with email", error)
            throw new Error("Error finding user with email")
        }
    }

    async updateUser(id: string, data: Partial<UserType>): Promise<UserType | null> {
        try{
            return await this.update(id, data)
        } catch(error){
            console.error("Error updating user", error);
            throw new Error("Error updating user")
        }
    }

    async findUserById(id: string): Promise<UserType | null>{
        try{
            return await this.findById(id)
        } catch(error){
            console.error("Error updating user", error);
            throw new Error("Error updating user")
        }
    }


    async listAllStudents(): Promise<UserType[] | null> {
        try {
          return await this.findByQuery({role: "student"});
        } catch (err) {
          console.log("Error updating student profile");
          throw new Error("Error updating student profile");
        }
    }
}

export default new UserRepository()