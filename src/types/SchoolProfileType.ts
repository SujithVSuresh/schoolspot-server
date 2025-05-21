import mongoose from "mongoose";


export interface SchoolProfileEntityType {
  _id?: mongoose.Types.ObjectId | string;
  schoolName: string;
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
