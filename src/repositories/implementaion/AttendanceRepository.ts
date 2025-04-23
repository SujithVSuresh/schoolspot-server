import { AttendaceEntityType } from "../../types/types";
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

  async createAttendace(data: AttendaceEntityType[]): Promise<AttendaceEntityType[]> {
    try {
      const response = await Attendance.insertMany(data);

      return response;
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

  async findAttendanceCount(query: any): Promise<{present: number, absent: number, date: Date} | null> {
    const attendanceCount = await Attendance.aggregate([
      {
        $match: {
          ...query
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          createdAt: { $first: "$createdAt" }
        }
      },
      {
        $group: {
          _id: null,
          present: {
            $sum: {
              $cond: [{ $eq: ["$_id", "Present"] }, "$count", 0]
            }
          },
          absent: {
            $sum: {
              $cond: [{ $eq: ["$_id", "Absent"] }, "$count", 0]
            }
          },
          date: { $first: "$createdAt" }
        }
      },
      {
        $project: {
          _id: 0,
          present: 1,
          absent: 1,
          date: 1
        }
      }
    ])

    return attendanceCount[0] ? attendanceCount[0] : null
    
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
