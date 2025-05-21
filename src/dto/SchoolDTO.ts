import mongoose from "mongoose";


export interface CreateSchoolProfileDTO {
  address: {
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  board: string;
  phoneNumber: string;
  schoolName: string;
  principalName: string;
  regNumber: string;
  totalStudents: number;
  totalTeachers: number;
  websiteUrl: string;
  yearEstablished: number;
}

export interface SchoolProfileResponseDTO {
  _id?: string;
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



