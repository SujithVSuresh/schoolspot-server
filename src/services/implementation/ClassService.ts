import { IClassRepository } from "../../repositories/interface/IClassRepository";
import { CreateClassDTO, SubjectDTO } from "../../dto/ClassDTO";
import { ClassResponseDTO } from "../../dto/ClassDTO";
import IClassService from "../interface/IClassService";
import { ClassEntityType, SubjectEntityType } from "../../types/types";
import mongoose from "mongoose";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { ITeacherRepository } from "../../repositories/interface/ITeacherRepository";
import { IAnnouncementRepository } from "../../repositories/interface/IAnnouncementRepository";
import { AnnouncementDTO, AnnouncementResponseDTO } from "../../dto/ClassDTO";

export class ClassService implements IClassService {
  constructor(
    private _classRepository: IClassRepository,
    private _teacherRepository: ITeacherRepository,
    private _announcementRepository: IAnnouncementRepository
  ) {}

  async createClass(dto: CreateClassDTO): Promise<ClassResponseDTO> {
    const classEntity: ClassEntityType = {
      name: dto.name,
      section: dto.section,
      strength: dto.strength,
      teacher: new mongoose.Types.ObjectId(dto.teacher),
      school: new mongoose.Types.ObjectId(dto.school),
    };

    const classExist = await this._classRepository.findClass({
      name: classEntity.name,
      section: classEntity.section,
      school: classEntity.school,
    });

    if (classExist) {
      throw new CustomError(Messages.USER_EXIST, HttpStatus.CONFLICT);
    }

    const response = await this._classRepository.createClass(classEntity);

    return {
      _id: response._id,
      name: response.name,
      section: response.section,
      strength: response.strength,
      createdAt: response.createdAt,
    };
  }

  async findAllClasses(schoolId: string): Promise<ClassResponseDTO[]> {
    const response = await this._classRepository.findAllClasses(schoolId);

    return response;
  }

  async findClassById(id: string): Promise<ClassResponseDTO> {
    const response = await this._classRepository.findClassById(id);
    if (!response) {
      throw new CustomError(Messages.CLASS_NOT_FOUNT, HttpStatus.NOT_FOUND);
    }
    return {
      _id: response._id,
      name: response.name,
      section: response.section,
      teacher: response.teacher,
      strength: response.strength,
    };
  }

  async addSubject(data: SubjectDTO, classId: string): Promise<SubjectDTO> {
    const subjectData: SubjectEntityType = {
      name: data.name,
      teacher: data.teacher as mongoose.Types.ObjectId,
    };
    const response = await this._classRepository.addSubject(
      subjectData,
      classId
    );

    if (!response) {
      throw new CustomError(
        Messages.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const teacher = await this._teacherRepository.findTeacherById(
      String(response.teacher)
    );
    if (!teacher) {
      throw new CustomError(
        Messages.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return {
      name: response.name,
      _id: response._id,
      teacher: teacher?.fullName as string,
    };
  }

  async removeSubject(subjectId: string, classId: string): Promise<string> {
    const response = await this._classRepository.removeSubject(
      subjectId,
      classId
    );

    if (!response) {
      throw new CustomError(
        Messages.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return response;
  }

  async updateSubject(
    subjectId: string,
    classId: string,
    data: SubjectDTO
  ): Promise<SubjectDTO> {
    const subjectExist = await this._classRepository.findSubjectByName(
      data.name,
      classId
    );

    console.log(subjectExist, "existing subjects...");

    if (subjectExist) {
      throw new CustomError(Messages.SUBJECT_EXIST, HttpStatus.CONFLICT);
    }

    const response = await this._classRepository.updateSubject(
      subjectId,
      classId,
      data
    );

    console.log(response, "thhis is the response");

    if (!response) {
      throw new CustomError(
        Messages.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const teacher = await this._teacherRepository.findTeacherById(
      String(response.teacher)
    );
    if (!teacher) {
      throw new CustomError(
        Messages.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return {
      name: response.name,
      _id: response._id,
      teacher: teacher?.fullName as string,
    };
  }

  async addAnnouncement(
    data: AnnouncementDTO
  ): Promise<AnnouncementResponseDTO> {
    const sendToData = data.sendTo.map(
      (item) => new mongoose.Types.ObjectId(item)
    );

    const response = await this._announcementRepository.addAnnouncement({
      ...data,
      sendTo: sendToData,
    });

    return {
      _id: response._id,
      title: response.title,
      content: response.content,
      author: response.author,
      creartedAt: response.createdAt as Date,
    };
  }

  async updateAnnouncement(
    id: string,
    data: AnnouncementDTO
  ): Promise<AnnouncementResponseDTO | null> {
    const sendToData = data.sendTo.map(
      (item) => new mongoose.Types.ObjectId(item)
    );
    const response = await this._announcementRepository.updateAnnouncement(id, {
      ...data,
      sendTo: sendToData,
    });

    if (!response) {
      throw new CustomError(
        Messages.SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return {
      _id: response._id,
      title: response.title,
      content: response.content,
      author: response.author,
      creartedAt: response.createdAt as Date,
    };
  }
}
