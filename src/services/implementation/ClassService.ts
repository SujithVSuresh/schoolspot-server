import { IClassRepository } from "../../repositories/interface/IClassRepository";
import {
  AnnouncementPinnedResponseDTO,
  ClassByIdResponseDTO,
  ClassListResponseDTO,
  CreateClassDTO,
} from "../../dto/ClassDTO";
import { ClassResponseDTO } from "../../dto/ClassDTO";
import IClassService from "../interface/IClassService";
import {
  AnnouncementEntityType,
  ClassEntityType,
  SubjectEntityType,
} from "../../types/types";
import mongoose, { ObjectId } from "mongoose";
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
      _id: response._id,
      name: response.name,
      section: response.section,
      teacher: response.teacher,
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
  ): Promise<ClassListResponseDTO[]> {
    const response = await this._classRepository.findClassByTeacherId(
      teacherId
    );

    const data: ClassListResponseDTO[] = response.map((item) => {
      return {
        _id: String(item._id),
        name: item.name,
        section: item.section,
        strength: item.strength,
      };
    });

    return data;
  }

  async getClassIdsForUsers(
    userId: string,
    role: "superadmin" | "admin" | "teacher" | "student",
    schoolId: string
  ): Promise<{ name: string; section: string; id: string }[]> {
    let classIds: { name: string; section: string; id: string }[] = [];

    switch (role) {
      case "admin":
        const adminClasses = await this._classRepository.findAllClasses(
          schoolId
        );
        classIds = adminClasses.map((classData) => {
          return {
            id: String(classData._id),
            name: classData.name,
            section: classData.section,
          };
        });
        break;
      case "teacher":
        const teacherClasses = await this._classRepository.findClassByTeacherId(
          userId
        );
        classIds = teacherClasses.map((classData) => {
          return {
            id: String(classData._id),
            name: classData.name,
            section: classData.section,
          };
        });
        break;
      case "student":
        const studentClass = await this._studentRepository.getStudentById(
          userId
        );
        classIds = [
          {
            id: String(studentClass?._id),
            name: studentClass?.class as string,
            section: studentClass?.section as string,
          },
        ];
        break;
      default:
        console.log("No user role matches");
    }

    return classIds;
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
      author: response.author,
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
  ): Promise<AnnouncementPinnedResponseDTO> {

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
      author: response.author,
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
          author: announcement.author,
          createdAt: announcement.createdAt,
          pinned: announcement.pinned,
        };
      }
    );

    return announcements;
  }

  async findAnnouncementDetails(announcementId: string, userId: string): Promise<AnnouncementPinnedResponseDTO> {
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
      author: response.author,
      createdAt: response.createdAt,
      isPinned: isPinned
    }
  }

  async findPinnedAnnouncements(userId: string): Promise<AnnouncementResponseDTO[]>{
    const response = await this._announcementRepository.findPinnedAnnouncements(userId)

    const announcements: AnnouncementResponseDTO[] = response.map(
      (announcement) => {
        return {
          _id: String(announcement._id),
          title: announcement.title,
          content: announcement.content,
          author: announcement.author,
          createdAt: announcement.createdAt,
          pinned: announcement.pinned,
        };
      }
    )

      return announcements

  }

  
}
