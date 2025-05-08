

export interface CreateNotificationDTO {
        userId: string[];
        notificationType: string; 
        message: string; 
}


export interface NotificationResponseDTO {
    _id: string;
    notificationType: string; 
    message: string; 
    createdAt: Date;
}