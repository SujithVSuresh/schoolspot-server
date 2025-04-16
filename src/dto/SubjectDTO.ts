

export interface CreateSubjectDTO {
    name: string;
    teacher: string;
    class: string;
    school: string;
}

export interface UpdateSubjectDTO {
    name: string;
    teacher: string;
}

export interface SubjectResponseDTO {
    _id: string;
    name: string;
    teacher: string;
}
  
