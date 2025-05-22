export type NotificationTypesType = 'message' | 'study_material' | 'assignment' | 'invoice' | 'exam' | 'exam_result'


export interface CreateNotificationDTO {
        userId: string[];
        notificationType: NotificationTypesType; 
        message: string; 
}


export interface NotificationResponseDTO {
    _id: string;
    notificationType: NotificationTypesType; 
    message: string; 
    createdAt: Date;
}