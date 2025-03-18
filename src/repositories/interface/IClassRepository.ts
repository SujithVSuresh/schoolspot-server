import { TeacherProfileType } from "../../types/types";
import { ClassEntityType } from "../../types/types";
import mongoose from "mongoose";

export interface IClassRepository {
    createClass(data: ClassEntityType): Promise<ClassEntityType>;
    findClass(data: {name: string, section: string, school: mongoose.Types.ObjectId}): Promise<ClassEntityType | null>
}