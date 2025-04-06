
type submissionType = "file" | "link" | "text";

export interface CreateAssignmentDTO {
  title: string;
  description: string;
  link?: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  schoolId: string;
  submissionType: submissionType
  dueDate: Date;
}

export interface AssignmentResponseDTO {
      _id?: string;
      title: string;
      description: string;
      link?: string;
      submissionType: submissionType;
      dueDate: Date;
      createdAt?: Date;
}

export interface AssignmentListResponseDTO {
    _id?: string;
    title: string;
    dueDate: Date;
    createdAt?: Date;
}