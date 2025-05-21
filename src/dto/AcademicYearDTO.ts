export interface CreateAcademicYearDTO {
  schoolId: string; 
  name: "2023-24" | "2024-25" | "2025-26";  
  isActive: boolean;        
}


export interface AcademicYearResponseDTO {
  _id?: string;     
  schoolId: string; 
  name: "2023-24" | "2024-25" | "2025-26";  
  isActive: boolean;        
}