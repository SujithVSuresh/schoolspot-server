import {
  CreateAcademicYearDTO,
  AcademicYearResponseDTO,
} from "../../dto/AcademicYearDTO";
import { IAcademicYearRepository } from "../../repositories/interface/IAcademicYearRepository";
import { IAcademicYearService } from "../interface/IAcademicYearService";
import { CustomError } from "../../utils/CustomError";
import Messages from "../../constants/MessageConstants";
import HttpStatus from "../../constants/StatusConstants";

export class AcademicYearService implements IAcademicYearService {
  constructor(private _academicYearRepository: IAcademicYearRepository) {}

  async createAcademicYear(
    data: CreateAcademicYearDTO
  ): Promise<AcademicYearResponseDTO> {
    const academicYear = await this._academicYearRepository.findAcademicYear({
        schoolId: data.schoolId,
        name: data.name
    });

    if (academicYear) {
      throw new CustomError(Messages.ACADEMIC_YEAR_EXIST, HttpStatus.CONFLICT);
    }

    const response = await this._academicYearRepository.createAcademicYear(
      data
    );

    return {
      _id: String(response._id),
      schoolId: String(response.schoolId),
      name: response.name,
      isActive: response.isActive,
    };
  }

  async findAcademicYearsBySchool(
    schoolId: string
  ): Promise<AcademicYearResponseDTO[]> {
    const response =
      await this._academicYearRepository.findAcademicYearsBySchool(schoolId);

    const academicYears: AcademicYearResponseDTO[] = response.map((item) => {
      return {
        _id: String(item._id),
        schoolId: String(item.schoolId),
        name: item.name,
        isActive: item.isActive,
      };
    });

    return academicYears
  }


  async updateAcademicYearStatus(id: string, schoolId: string): Promise<AcademicYearResponseDTO> {
    const activeAcademicYear = await this._academicYearRepository.findAcademicYear({
        schoolId: schoolId,
        isActive: true
    })

    if(!activeAcademicYear){
        throw new CustomError(Messages.ACTIVE_ACADEMIC_YEAR_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    if(String(activeAcademicYear?._id) == id){
        return {
            _id: String(activeAcademicYear?._id),
            schoolId: String(activeAcademicYear?.schoolId),
            name: activeAcademicYear?.name,
            isActive: activeAcademicYear?.isActive
        }
    }

    const updateActiveAcademicYear = await this._academicYearRepository.updateAcademicYear(String(activeAcademicYear._id), {
        isActive: false
    })

    if(!updateActiveAcademicYear){
        throw new CustomError(Messages.ACTIVE_ACADEMIC_YEAR_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    const response = await this._academicYearRepository.updateAcademicYear(id, {isActive: true})

    
    if(!response){
        throw new CustomError(Messages.ACTIVE_ACADEMIC_YEAR_NOT_FOUND, HttpStatus.NOT_FOUND)
    }
        return {
            _id: String(response?._id),
            schoolId: String(response?.schoolId),
            name: response?.name,
            isActive: response?.isActive
        }
  }
}
