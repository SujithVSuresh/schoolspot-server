

export interface StudentResponseDTO {
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
  _id: string;
  classId: string;
  user: {
      _id: string;
      email: string;
      status: "active" | "inactive" | "deleted" | "blocked";
    };
}




