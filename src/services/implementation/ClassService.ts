import { IClassRepository } from "../../repositories/interface/IClassRepository";
import { CreateClassDTO } from "../../dto/ClassDTO";
import { ClassResponseDTO } from "../../dto/ClassDTO";
import IClassService from "../interface/IClassService";
import { ClassEntityType } from "../../types/types";
import mongoose from "mongoose";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";

export class ClassService implements IClassService {
    constructor(
      private _classRepository: IClassRepository,
    ) {}

    async createClass(dto: CreateClassDTO): Promise<ClassResponseDTO> {
        const classEntity: ClassEntityType = {
            name: dto.name,
            section: dto.section,
            strength: dto.strength,
            teacher: new mongoose.Types.ObjectId(dto.teacher),
            school: new mongoose.Types.ObjectId(dto.school)
          };

          const classExist = await this._classRepository.findClass({name: classEntity.name, section: classEntity.section, school: classEntity.school})

          if(classExist){
            throw new CustomError(Messages.USER_EXIST, HttpStatus.CONFLICT);
          }

          const response = await this._classRepository.createClass(classEntity)

          return {
            _id: response._id,
            name: response.name,
            section: response.section,
            strength: response.strength,
            createdAt: response.createdAt
          }
    }

    async findAllClasses(schoolId: string): Promise<ClassResponseDTO[]>{
      const response = await this._classRepository.findAllClasses(schoolId)

      return response
    }

    async findClassById(id: string): Promise<ClassResponseDTO> {
      const response = await this._classRepository.findClassById(id)
      if(!response){
          throw new CustomError(
            Messages.CLASS_NOT_FOUNT,
            HttpStatus.NOT_FOUND
          );
      }
      return {
        _id: response._id,
        name: response.name,
        section: response.section,
        teacher: response.teacher,
        strength: response.strength 
      }
    }

}