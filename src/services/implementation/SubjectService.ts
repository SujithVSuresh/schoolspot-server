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
        name: { $regex: `^${name}$`, $options: 'i' },
        class: data.class
  })

      if(subjectExist){
        throw new CustomError(Messages.CLASS_EXIST, HttpStatus.CONFLICT)
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

  async updateSubject(subjectId: string, classId: string, data: UpdateSubjectDTO): Promise<SubjectResponseDTO> {
    const subjectExist = await this._subjectRepository.findSubject({
      name: { $regex: `^${name}$`, $options: 'i' },
      class: classId
})
    if(subjectExist?._id){
      throw new CustomError(Messages.SUBJECT_EXIST, HttpStatus.CONFLICT)
    }

    const updatedSubject = await this._subjectRepository.updateSubject(subjectId, data)

    return {
      _id: String(updatedSubject?._id),
      name: updatedSubject?.name as string,
      teacher: String(updatedSubject?.teacher)
    }
  }


}