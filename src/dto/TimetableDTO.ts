export interface Period {
    subject: string;
    startTime: string;
    endTime: string;
  }
  
  export interface DaySchedule {
    day: string;
    periods: Period[];
  }
  
  export interface CreateTimetableDTO {
    classId: string;
    timetable: DaySchedule[];
  }

  export interface UpdateTimetableDTO {
    classId: string;
    timetable: DaySchedule[];
  }


  export interface TimetableResponseDTO {
    _id: string;
    classId: string;
    timetable: DaySchedule[];
  }