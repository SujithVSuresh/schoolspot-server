import mongoose from "mongoose";


export interface SchoolProfileDTO {
  _id?: mongoose.Types.ObjectId;
  schoolName: string;
  email?: string;
  phoneNumber: string;
  regNumber: string;
  yearEstablished: number;
  principalName: string;
  websiteUrl: string;
  totalStudents: number;
  totalTeachers: number;
  board: string;
  address: {
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

