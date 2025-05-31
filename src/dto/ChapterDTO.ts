export interface CreateChapterDTO {
  title: string;
  number: number;
  description?: string;
  subject: string;     
  classGrade: string;   
  school:string;      
}

export interface UpdateChapterDTO {
  title: string;
  number: number;
  description?: string;     
}


export interface ChapterResponseDTO {
  _id: string
  title: string;
  number: number;
  description?: string;
  subject: string;     
  classGrade: string;   
  school:string;      
}
