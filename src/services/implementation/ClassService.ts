import { IClassRepository } from "../../repositories/interface/IClassRepository";
import { ClassByIdResponseDTO, ClassListResponseDTO, CreateClassDTO, SubjectDTO } from "../../dto/ClassDTO";
import { ClassResponseDTO } from "../../dto/ClassDTO";
import IClassService from "../interface/IClassService";
import { AnnouncementEntityType, ClassEntityType, SubjectEntityType } from "../../types/types";
import mongoose from "mongoose";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { ITeacherRepository } from "../../repositories/interface/ITeacherRepository";
import { IAnnouncementRepository } from "../../repositories/interface/IAnnouncementRepository";
import { AnnouncementDTO, AnnouncementResponseDTO } from "../../dto/ClassDTO";
import { IAttendanceRepository } from "../../repositories/interface/IAttendanceRepository";

export class ClassService implements IClassService {
  constructor(
    private _classRepository: IClassRepository,
    private _teacherRepository: ITeacherRepository,
    private _announcementRepository: IAnnouncementRepository,
    private _attendanceRepository: IAttendanceRepository
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

  async findClassById(classId: string, userId: string, userType: string): Promise<ClassByIdResponseDTO> {
    const response = await this._classRepository.findClassById(classId);
    if (!response) {
      throw new CustomError(Messages.CLASS_NOT_FOUNT, HttpStatus.NOT_FOUND);
    }

    const now = new Date();
    const startOfUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
    const endOfUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

    const attendace = await this._attendanceRepository.findAttendanceCount({
            class: new mongoose.Types.ObjectId(classId),
            createdAt: {
              $gte: startOfUTC,
              $lt: endOfUTC,
            },
    })

    console.log(attendace, "this is the attendance data")

    const data: ClassByIdResponseDTO = {
        _id: response._id,
        name: response.name,
        section: response.section,
        teacher: response.teacher,
        strength: response.strength,
        subjects: response.subjects,
        attendance: {
          presentCount: attendace ? attendace.present : 0,
          absentCount: attendace ? attendace.absent : 0,
          date: attendace ? attendace.date : new Date()
        }
    }
    
    if (userType == "teacher") {
      const subject = await this._classRepository.findSubjectByTeacherId(userId, classId);
      if (subject) {
        data.subject = subject;
      }
    }


    return data;
  }

  async findAllClassesByTeacherId(teacherId: string): Promise<ClassListResponseDTO[]> {
    const response = await this._classRepository.findClassByTeacherId(teacherId);

    const data: ClassListResponseDTO[] = response.map((item) => {
        return {
          _id: String(item._id),
          name: item.name,
          section: item.section,
          strength: item.strength,
        }
    })

    return data
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

    return subjectId;
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


  async fetchAnnouncements(
    schoolId: string
  ): Promise<AnnouncementEntityType[]> {

    const response = await this._announcementRepository.getAnnouncements(schoolId);

    return response;
  }
}
