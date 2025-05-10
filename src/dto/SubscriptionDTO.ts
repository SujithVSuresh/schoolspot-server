

export interface CreatePlanDTO {
  name: "Free" | "3 Month" | "6 Month";
  price: number;
  durationInDays: 30 | 90 | 180;
}

export interface PlanResponseDTO {
  _id?: string;
  name: "Free" | "3 Month" | "6 Month";
  price: number;
  durationInDays: 30 | 90 | 180;
  createdAt?: Date;
  updatedAt?: Date;
}