
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

export interface UpdateAssignmentDTO {
  title: string;
  description: string;
  link?: string;
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

export interface AssignmentSubmissionsWithAssignmentResponseDTO {
  _id: string;
  assignmentId: {
      _id?: string;
      title: string;
      description: string;
      dueDate: Date;
      createdAt?: Date;
};
  status: "Pending" | "Submitted" | "Graded";
}

export interface AssignmentSubmissionResponseDTO {
  _id: string;
  assignmentId: string | AssignmentResponseDTO;
  description?: string;
  link?: string;
  fileUrl?: string;
  grade?: string;
  feedback?: string;
  status: "Pending" | "Submitted" | "Graded";
  createdAt?: Date;
  student?: {
    _id: string,
    fullName: string,
    class: string,
    section: string,
    roll: number
  };
  submittedAt?: Date | null
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

export interface UpdateStudyMaterialDTO {
  title: string;
  description: string;
  link?: string;
  fileUrl?: string
}

export interface StudyMaterialResponseDTO {
  _id?: string;
  title: string;
  description: string;
  link?: string;
  fileUrl?: string;
  createdAt: Date;
}
export interface StudyMaterialResponseWithViewersDTO extends StudyMaterialResponseDTO {
  viewers: {
    _id: string;
    fullName: string
  }[]
}