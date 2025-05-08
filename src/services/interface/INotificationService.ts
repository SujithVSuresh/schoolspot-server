import { CreateNotificationDTO, NotificationResponseDTO } from "../../dto/NotificationDTO"

export interface INotificationService {
    sendNotification(data: CreateNotificationDTO): Promise<NotificationResponseDTO> 
    fetchNotifications(userId: string): Promise<NotificationResponseDTO[]>
}