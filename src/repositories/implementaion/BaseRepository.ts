import { Model, FilterQuery, ObjectId } from "mongoose";
import { IBaseRepository } from "../interface/IBaseRepository";

export class BaseRepository<T> implements IBaseRepository<T> {
    private model: Model<T>

    constructor(model: Model<T>){
        this.model = model
    }

    async create(data: Partial<T>): Promise<T> {
        return this.model.create(data)
    }

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id)
    }

    async findAll(): Promise<T[]> {
        return this.model.find()
    }

    async findByQuery(query: FilterQuery<T>): Promise<T[]> {
        return this.model.find(query)
    }

    async findOne(query: FilterQuery<T>): Promise<T | null> {
        return this.model.findOne(query)
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, data, {new: true})
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id);
        return result != null
    }
}