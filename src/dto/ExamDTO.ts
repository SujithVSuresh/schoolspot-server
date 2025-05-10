export interface ExamTimetableDTO {
    subject: string;
    date: Date;
    startTime: string;
    endTime: string;
  }
  

  export interface CreateExamDTO {
    name: string;
    classId: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    examTimetable: ExamTimetableDTO[];
  }

  export interface UpdateExamDTO {
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    examTimetable: ExamTimetableDTO[];
  }

  export interface ExamResponseDTO {
    _id: string;
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
  }

  export interface ExamWithTimeTableDTO extends ExamResponseDTO {
    examTimetable: ExamTimetableDTO[];
  }

  

