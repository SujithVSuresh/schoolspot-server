
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

export interface AssignmentSubmissionsListResponseDTO {
  _id: string;
  assignmentId: string;
  student: {
    _id: string,
    fullName: string,
    class: string,
    section: string,
    roll: number
  };
  status: "Pending" | "Submitted" | "Graded";
  submittedAt: Date | null
}

export interface CreateStudyMaterialDTO {
  title: string;
  description: string;
  link?: string;
  fileUrl?: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  schoolId: string;
}

export interface StudyMaterialResponseDTO {
  _id?: string;
  title: string;
  description: string;
  link?: string;
  fileUrl?: string;
  createdAt: Date
}