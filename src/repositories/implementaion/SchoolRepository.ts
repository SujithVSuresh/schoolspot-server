import School from "../../models/School";
import { BaseRepository } from "./BaseRepository";
import { ISchoolRepository } from "../interface/ISchoolRepository";
import { SchoolProfileEntityType } from "../../types/SchoolProfileType";

class SchoolRepository
  extends BaseRepository<SchoolProfileEntityType>
  implements ISchoolRepository
{
  constructor() {
    super(School);
  }

  async createSchoolProfile(
    data: SchoolProfileEntityType
  ): Promise<SchoolProfileEntityType> {
    try {
      return await this.create(data);
    } catch (error) {
      console.error("Error creating school profile", error);
      throw new Error("Error creating user");
    }
  }

  async findSchoolById(id: string): Promise<SchoolProfileEntityType | null> {
    try {
      return await this.findById(id);
    } catch (error) {
      console.error("Error finding school profile", error);
      throw new Error("Error finding school profile");
    }
  }

  async updateSchoolProfile(
    id: string,
    data: SchoolProfileEntityType
  ): Promise<SchoolProfileEntityType | null> {
    try {
      return await this.update(id, data);
    } catch (error) {
      console.error("Error updating school profile", error);
      throw new Error("Error updating school profile");
    }
  }

  async findSchools(): Promise<SchoolProfileEntityType[]> {
    try {
      return await this.findAll();
    } catch (error) {
      console.error("Error finding school profile", error);
      throw new Error("Error finding school profile");
    }
  }
}

export default new SchoolRepository();
