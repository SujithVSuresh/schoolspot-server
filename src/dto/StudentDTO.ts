

export interface CreateStudentDTO {
    fullName: string;
    profilePhoto: string;
    gender: "male" | "female";
    dob: Date;
    roll: number;
    address: string;
    fatherName: string;
    motherName: string;
    contactNumber: string;
    email: string;
    password: string;
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
  _id: string,
  fullName: string,
  class: string,
  section: string,
  roll: number,
  profilePhoto: string,
  user: {
    _id: string;
    email: string;
    status: "active" | "inactive" | "deleted" | "blocked";
  }
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
  classFilter: string[] | [];
  sortOrder: "asc" | "desc";
  statusFilter?: "active" | "inactive" | "deleted" | "blocked" | "";
}


