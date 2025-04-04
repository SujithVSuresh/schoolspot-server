

export interface CreateAssignmentDTO {
  title: string;
  description: string;
  link?: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  schoolId: string;
  submissionType: "file" | "link" | "text";
  dueDate: Date;
}

export interface AssignmentResponseDTO {
      _id?: string;
      title: string;
      description: string;
      link?: string;
      submissionType: "file" | "link" | "text";
      dueDate: Date;
      createdAt?: Date;
    
}