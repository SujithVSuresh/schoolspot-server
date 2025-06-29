export interface CreateStudentDTO {
  fullName: string;
  profilePhoto: string;
  gender: "male" | "female";
  dob: Date;
  address: string;
  fatherName: string;
  motherName: string;
  email: string;
  password: string;
  parentContactNumber: string;
  parentEmailAddress: string;
  admissionNo: string;
  schoolId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateStudentDTO {
  fullName: string;
  profilePhoto?: string;
  gender: "male" | "female";
  dob: Date;
  roll: number;
  address: string;
  fatherName: string;
  motherName: string;
  contactNumber: string;
  email: string;
}

export interface StudentResponseDTO {
  _id: string;
  fullName: string;
  profilePhoto: string;
  gender: "male" | "female";
  dob: Date;
  address: string;
  fatherName: string;
  motherName: string;
  parentContactNumber: string;
  parentEmailAddress: string;
  admissionNo: string;
  schoolId: {
    _id: string;
    schoolName: string;
  };
  userId: {
    _id: string;
    email: string;
    status: "active" | "inactive" | "deleted" | "blocked";
  };
}

export interface StudentWithAcademicProfileResponseDTO extends StudentResponseDTO {
  academicProfile: {
    _id?: string;
    name: string;
    section: string;
    roll: number;
  } | null;
}

export interface StudentListResponseDTO {
  _id: string;
  fullName: string;
  profilePhoto: string;
  admissionNo: string;
  fatherName: string;
  motherName: string;
  parentContactNumber: string;
  parentEmailAddress: string;
  userId: {
    _id: string;
    email: string;
    status: "active" | "inactive" | "deleted" | "blocked";
  };
}

export interface StudentPagenationResponseDTO {
  totalStudents: number;
  totalPages: number;
  currentPage: number;
  students: StudentListResponseDTO[];
}

export interface StudentSearchQueryDTO {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  statusFilter?: "active" | "inactive" | "deleted" | "blocked" | "";
}

// ------ Student Academic Profile -------

export interface CreateStudentAcademicProfileDTO {
  studentId?: string;
  userId?: string;
  roll: number;
  classId: string;
}

export interface StudentAcademicProfileResponseDTO {
  _id: string;
  studentId: string;
  userId: string;
  roll: number;
  classId: string;
}

export interface StudentAcademicProfileWithClassResponseDTO {
  _id: string;
  studentId: string;
  userId: string;
  roll: number;
  classId: {
    _id: string;
    name: string;
    section: string;
  };
}

export interface StudentAcademicProfileWithProfileResponseDTO {
  _id: string;
  studentId: {
    _id: string;
    fullName: string;
    profilePhoto: string;
  };
  userId: string;
  roll: number;
  classId: string;
}
