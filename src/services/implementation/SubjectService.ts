import mongoose from "mongoose";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { CreateSubjectDTO, SubjectResponseDTO, UpdateSubjectDTO } from "../../dto/SubjectDTO";
import { ISubjectRepository } from "../../repositories/interface/ISubjectRepository";
import { CustomError } from "../../utils/CustomError";
import { ISubjectService } from "../interface/ISubjectService";




export class SubjectService implements ISubjectService {
  constructor(
    private _subjectRepository: ISubjectRepository
  ) {}

  async createSubject(data: CreateSubjectDTO): Promise<SubjectResponseDTO> {
      const subjectExist = await this._subjectRepository.findSubject({
        name: { $regex: `^${data.name}$`, $options: 'i' },
        class: data.class,
  })

      if(subjectExist){
        throw new CustomError(Messages.SUBJECT_EXIST, HttpStatus.CONFLICT)
      }

      const teacherExist = await this._subjectRepository.findSubject(
        {
          class: data.class,
          teacher: new mongoose.Types.ObjectId(data.teacher)
        }
      )

      if(teacherExist){
        throw new CustomError("Teacher already exist in this class", HttpStatus.CONFLICT)
      }

     const subject =  await this._subjectRepository.createSubject(data)
     
     return {
        _id: String(subject._id),
        name: subject.name,
        teacher: String(subject.teacher)
     }
  }

  async findSubjectsByClass(classId: string): Promise<SubjectResponseDTO[]> {
    const subjects = await this._subjectRepository.findSubjectsByClassId(classId)

    const subjectsData: SubjectResponseDTO[] = subjects.map((subject) => {
      return {
        _id: String(subject._id),
        name: subject.name,
        teacher: String(subject.teacher)
      }
    })

    return subjectsData
  }

  async deleteSubject(subjectId: string): Promise<{ _id: string; }> {
    const response = await this._subjectRepository.deleteSubject(subjectId)

    if(!response){
      throw new CustomError(Messages.SUBJECT_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return {
      _id: subjectId
    }
  }

  async findSubjectById(subjectId: string): Promise<SubjectResponseDTO> {
    const response = await this._subjectRepository.findSubjectById(subjectId)

    if(!response){
      throw new CustomError(Messages.SUBJECT_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return {
      _id: String(response._id),
      name: response.name,
      teacher: String(response.teacher)
    }
  }

  async updateSubject(subjectId: string, classId: string, data: UpdateSubjectDTO): Promise<SubjectResponseDTO> {

    const subjectExist = await this._subjectRepository.findSubject({
      name: { $regex: `^${data.name}$`, $options: 'i' },
      class: classId
    })

    if(subjectExist?._id && subjectExist._id != subjectId){
      throw new CustomError(Messages.SUBJECT_EXIST, HttpStatus.CONFLICT)
    }

    const updatedSubject = await this._subjectRepository.updateSubject(subjectId, data)

    if(!updatedSubject){
      throw new CustomError(Messages.SUBJECT_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return {
      _id: String(updatedSubject?._id),
      name: updatedSubject?.name as string,
      teacher: String(updatedSubject?.teacher)
    }
  }


}