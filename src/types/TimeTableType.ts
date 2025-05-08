import mongoose from "mongoose";


export interface Period {
    subject: mongoose.Types.ObjectId | string;
    startTime: string;
    endTime: string;
  }
  
  export interface DaySchedule {
    day: string;
    periods: Period[];
  }
  
  export interface TimeTableEntityType {
    classId: mongoose.Types.ObjectId | string;
    timetable: DaySchedule[];
    createdAt?: Date;
    updatedAt?: Date;
  }
  