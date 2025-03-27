import { AnnouncementEntityType, AttendaceEntityType } from "../../types/types";
import { BaseRepository } from "./BaseRepository";
import { IAttendanceRepository } from "../interface/IAttendanceRepository";
import Attendance from "../../models/Attendance";
import { AttendaceResponseDTO } from "../../dto/AttendanceDTO";

class AttendanceRepository
  extends BaseRepository<AttendaceEntityType>
  implements IAttendanceRepository
{
  constructor() {
    super(Attendance);
  }

  async createAttendace(data: AttendaceEntityType[]): Promise<string> {
    try {
      const response = await Attendance.insertMany(data);

      return String(response[0].class);
    } catch (error) {
      console.error("Error adding attendance", error);
      throw new Error("Error adding attendance");
    }
  }

  async findAttendanceByQuery(query: any): Promise<AttendaceEntityType | null> {
    try {
      const response = await this.findOne(query);
      return response ? response : null; 

    } catch (error) {
      console.error("Error finding attendance", error);
      throw new Error("Error finding attendance");
    }
  }

  async findManyAttendanceByQuery(
    query: any
  ): Promise<AttendaceResponseDTO[]> {
    try {
      const attendanceData = await Attendance.aggregate([
        {
          $match: {
            ...query
          }
        },
        {
          $lookup: {
            from: "Students",
            localField: "student",
            foreignField: "userId",
            as: "studentDetails"
          }
        },
        { $unwind: "$studentDetails" },
        {
          $project: {
            _id: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            student: {
              _id: "$studentDetails._id",
              name: "$studentDetails.fullName",
              roll: "$studentDetails.roll"
            }
          }
        }
      ])
      return attendanceData;
    } catch (error) {
      console.error("Error finding attendance", error);
      throw new Error("Error finding attendance");
    }
  }

  async updateAttendanceStatus(attendaceId: string, data: AttendaceEntityType): Promise<AttendaceEntityType | null> {
    try{
      const response = await this.update(attendaceId, data)

      return response ? response : null; 

    }catch(error){
      console.error("Error finding attendance", error);
      throw new Error("Error finding attendance");
    }
  }
}

export default new AttendanceRepository();
