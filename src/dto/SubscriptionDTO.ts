import { SubscriptionStatusType } from "../types/SubscriptionType";

export interface CreatePlanDTO {
  name: "Free" | "3 Month" | "6 Month";
  price: number;
  durationInDays: 30 | 90 | 180;
}

export type UpdatePlanDTO = Partial<CreatePlanDTO>;


export interface PlanResponseDTO {
  _id?: string;
  name: "Free" | "3 Month" | "6 Month";
  price: number;
  durationInDays: 30 | 90 | 180;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSubscriptionDTO {
  userId: string;
  schoolId: string;
  planId: string;
  planPrice: number;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatusType;
}

export interface SubscriptionResponseDTO {
  _id: string
  userId: string;
  schoolId: string;
  planId: string;
  planPrice: number;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatusType;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionListResponseDTO {
  _id: string
  planId: string;
  planPrice: number;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatusType;
  createdAt: Date;
  updatedAt: Date;
}