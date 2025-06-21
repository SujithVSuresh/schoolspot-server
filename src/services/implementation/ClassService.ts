import { IClassRepository } from "../../repositories/interface/IClassRepository";
import {
  AnnouncementDetailsResponseDTO,
  ClassByIdResponseDTO,
  ClassListResponseDTO,
  CreateClassDTO,
  UpdateClassDTO,
} from "../../dto/ClassDTO";
import { ClassResponseDTO } from "../../dto/ClassDTO";
import IClassService from "../interface/IClassService";
import { ClassEntityType } from "../../types/ClassType";
import mongoose from "mongoose";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";
import { IAnnouncementRepository } from "../../repositories/interface/IAnnouncementRepository";
import { AnnouncementDTO, AnnouncementResponseDTO } from "../../dto/ClassDTO";
import { IAttendanceRepository } from "../../repositories/interface/IAttendanceRepository";
import { IStudentRepository } from "../../repositories/interface/IStudentRepository";
import { ISubjectRepository } from "../../repositories/interface/ISubjectRepository";

export class ClassService implements IClassService {
  constructor(
    private _classRepository: IClassRepository,
    private _announcementRepository: IAnnouncementRepository,
    private _attendanceRepository: IAttendanceRepository,
    private _studentRepository: IStudentRepository,
    private _subjectRepository: ISubjectRepository
  ) {}

  async createClass(dto: CreateClassDTO): Promise<ClassResponseDTO> {
    const classEntity: ClassEntityType = {
      name: dto.name,
      section: dto.section.toUpperCase(),
      teacher: dto.teacher,
      school: dto.school,
      academicYear: dto.academicYear
    };

    const classExist = await this._classRepository.findClass({
      name: classEntity.name,
      section: classEntity.section,
      school: String(classEntity.school),
      academicYear: String(classEntity.academicYear)
    });

    if (classExist) {
      throw new CustomError(Messages.CLASS_EXIST, HttpStatus.CONFLICT);
    }

    const response = await this._classRepository.createClass(classEntity);

    return {
      _id: String(response._id),
      name: response.name,
      section: response.section,
      strength: response.strength,
      createdAt: response.createdAt,
    };
  }

  async updateClass(classId: string, dto: UpdateClassDTO): Promise<ClassResponseDTO> {
    const classEntity = {
      name: dto.name,
      section: dto.section.toUpperCase(),
      teacher: dto.teacher,
      school: dto.schoolId,
      academicYear: dto.academicYear
    };

    const classExist = await this._classRepository.findClass({
      name: classEntity.name,
      section: classEntity.section,
      school: classEntity.school,
      academicYear: classEntity.academicYear
    });

    if (classExist && classExist._id != classId) {
      throw new CustomError(Messages.CLASS_EXIST, HttpStatus.CONFLICT);
    }

    const response = await this._classRepository.updateClass(classId, classEntity);

    if(!response){
      throw new CustomError(Messages.CLASS_NOT_FOUNT, HttpStatus.NOT_FOUND)
    }

    return {
      _id: String(response._id),
      name: response.name,
      section: response.section,
      strength: response.strength,
      createdAt: response.createdAt,
    };
  }

  async deleteClass(classId: string): Promise<{ _id: string; }> {
    const response = await this._classRepository.deleteClass(classId)

    if(!response){
      throw new CustomError(Messages.CLASS_NOT_FOUNT, HttpStatus.NOT_FOUND)
    }

    return {
      _id: classId
    }
  }

  async findAllClasses(schoolId: string, academicYear: string): Promise<ClassResponseDTO[]> {
    const response = await this._classRepository.findAllClasses(schoolId, academicYear);

    const classesData: ClassResponseDTO[] = response.map((item) => {

      return {
            _id: String(item._id),
            name: item.name,
            section: item.section,
            teacher: String(item.teacher),
            strength: item.strength,
      }
    });

    return classesData
  }

  async findClassById(
    classId: string,
    userId: string,
    userType: string
  ): Promise<ClassByIdResponseDTO> {
    const response = await this._classRepository.findClassById(classId);
    if (!response) {
      throw new CustomError(Messages.CLASS_NOT_FOUNT, HttpStatus.NOT_FOUND);
    }

    const now = new Date();
    const startOfUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0
      )
    );
    const endOfUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23,
        59,
        59,
        999
      )
    );

    const attendace = await this._attendanceRepository.findAttendanceCount({
      class: new mongoose.Types.ObjectId(classId),
      createdAt: {
        $gte: startOfUTC,
        $lt: endOfUTC,
      },
    });

    const data: ClassByIdResponseDTO = {
      _id: String(response._id),
      name: response.name,
      section: response.section,
      teacher: String(response.teacher),
      strength: response.strength,
      school: String(response.school),
      attendance: {
        presentCount: attendace ? attendace.present : 0,
        absentCount: attendace ? attendace.absent : 0,
        date: attendace ? attendace.date : new Date(),
      },
    };

    if (userType == "teacher") {
      const subject = await this._subjectRepository.findSubject({
        teacher: userId,
        class: classId,
      });

      if (subject) {
        data.subject = {
          _id: String(subject._id),
          name: subject.name,
          teacher: String(subject.teacher),
        };
      }
    }
    return data;
  }

  async findAllClassesByTeacherId(
    teacherId: string
  ): Promise<any> {
    const response = await this._subjectRepository.findClassesByTeacherIdUsingSubjects(teacherId)

    const data: ClassListResponseDTO[] = response.map((item) => {
      return {
        _id: String(item.class._id),
        name: item.class.name,
        section: item.class.section, 
        strength: item.class.strength
      };
    });

    return data;
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
      _id: String(response._id),
      title: response.title,
      content: response.content,
      author: response?.author as string,
      createdAt: response.createdAt as Date,
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
      _id: String(response._id),
      title: response.title,
      content: response.content,
      author: String(response.author),
      createdAt: response.createdAt as Date,
    };
  }

  async deleteAnnouncement(id: string): Promise<{ _id: string }> {
    const response = await this._announcementRepository.deleteAnnouncement(id);

    if (!response) {
      throw new CustomError(
        Messages.ANNOUNCEMENT_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return {
      _id: id,
    };
  }

  async updatePinnedStatus(
    announcementId: string,
    userId: string,
    status: "pin" | "unpin"
  ): Promise<AnnouncementDetailsResponseDTO> {

    // const announcements = await this._announcementRepository.findAnnouncements(
    //   null,
    //   null,
    // );

    // if (announcements.length > 2) {
    //   throw new CustomError(
    //     Messages.ANNOUNCEMENT_PIN_LIMIT,
    //     HttpStatus.CONFLICT
    //   );
    // }

    let response;

    if (status == "pin") {
      response = await this._announcementRepository.pinAnnouncement(
        announcementId,
        userId
      );
    } else if (status == "unpin") {
      response = await this._announcementRepository.unpinAnnouncement(
        announcementId,
        userId
      );
    }

    if (!response) {
      throw new CustomError(
        Messages.ANNOUNCEMENT_NOT_FOUND,
        HttpStatus.NOT_FOUND
      );
    }

    return {
      _id: String(response._id),
      title: response.title,
      content: response.content,
      author: String(response.author),
      createdAt: response.createdAt,
      isPinned: status == "pin" ? true : false
    };
  }

  async findAnnouncements(
    schoolId?: string | null,
    classId?: string,
  ): Promise<AnnouncementResponseDTO[]> {
    const response = await this._announcementRepository.findAnnouncements(
      !classId ? schoolId : null,
      classId ? classId : null
    );

    const announcements: AnnouncementResponseDTO[] = response.map(
      (announcement) => {
        return {
          _id: String(announcement._id),
          title: announcement.title,
          content: announcement.content,
          author: String(announcement.author),
          createdAt: announcement.createdAt,
          pinned: announcement.pinned,
        };
      }
    );

    return announcements;
  }

  async findAnnouncementDetails(announcementId: string, userId: string): Promise<AnnouncementDetailsResponseDTO> {
    const response = await this._announcementRepository.findAnnouncementById(announcementId)

    if(!response){
      throw new CustomError(Messages.ANNOUNCEMENT_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    let isPinned = false

    if(response.pinned?.includes(new mongoose.Types.ObjectId(userId))){
      isPinned = true
    }

    return {
      _id: String(response._id),
      title: response.title,
      content: response.content,
      author: String(response.author),
      createdAt: response.createdAt,
      isPinned: isPinned,
      sendTo: response.sendTo
    }
  }

  async findAnnouncementsByAuthor(userId: string): Promise<AnnouncementResponseDTO[]> {
    const response = await this._announcementRepository.findAnnouncementsByAuthor(userId)

    if(!response){
      throw new CustomError(Messages.ANNOUNCEMENT_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    const announcements: AnnouncementResponseDTO[] = response.map((announcement) => {
      return {
        _id: String(announcement._id),
        title: announcement.title,
        content: announcement.content,
        author: String(announcement.author),
        sendTo: announcement.sendTo.map((classId) => {
          return String(classId)
        }),
        createdAt: announcement.createdAt
      }
    })

    return announcements
  }

  async findPinnedAnnouncements(userId: string): Promise<AnnouncementResponseDTO[]>{
    const response = await this._announcementRepository.findPinnedAnnouncements(userId)

    const announcements: AnnouncementResponseDTO[] = response.map(
      (announcement) => {
        return {
          _id: String(announcement._id),
          title: announcement.title,
          content: announcement.content,
          author: String(announcement.author),
          createdAt: announcement.createdAt,
          pinned: announcement.pinned,
        };
      }
    )

      return announcements

  }


  async findAnnouncementsByCount(classId: string, count: number): Promise<AnnouncementResponseDTO[]> {
    const response = await this._announcementRepository.findAnnouncementsByCount(classId, count)

    if(!response){
      throw new CustomError(Messages.ANNOUNCEMENT_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    const announcements: AnnouncementResponseDTO[] = response.map(
      (announcement) => {
        return {
          _id: String(announcement._id),
          title: announcement.title,
          content: announcement.content,
          author: String(announcement.author),
          createdAt: announcement.createdAt,
          pinned: announcement.pinned,
        };
      }
    )

    return announcements
  }

  
}
