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
  class: string;
  section: string;
  roll: number;
  gender: "male" | "female";
  profilePhoto: string;
  dob: Date;
  address: string;
  fatherName: string;
  motherName: string;
  contactNumber: string;
  schoolId: string;
  classId: string;
  user: {
    _id: string;
    email: string;
    status: "active" | "inactive" | "deleted" | "blocked";
  };
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
  academicYear: string;
  roll: number;
  classId: string;
}

export interface StudentAcademicProfileResponseDTO {
  _id: string;
  studentId: string;
  userId: string;
  academicYear: string;
  roll: number;
  classId: string;
}

export interface StudentProfileResponseDTO {
  _id: string;
  studentId: {
    _id: string;
    fullName: string;
    profilePhoto: string;
    admissionNo: string;
    fatherName: string;
    motherName: string;
    parentContactNumber: string;
    parentEmailAddress: string;
    gender: "male" | "female";
    dob: Date;
    address: string;
    schoolId: string;
  };
  userId: {
    _id: string;
    email: string;
    status: "active" | "inactive" | "deleted" | "blocked";
  };
  academicYear: string;
  roll: number;
  classId: {
    _id: string;
    name: string;
    section: string;
  };
}
