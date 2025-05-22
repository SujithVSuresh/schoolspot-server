import { INotificationRepository } from "../../repositories/interface/INotificationRepository";
import { NotificationEntityType } from "../../types/NotificationType";
import { INotificationService } from "../interface/INotificationService";
import { CreateNotificationDTO, NotificationResponseDTO } from "../../dto/NotificationDTO";
import { NotificationTypesType } from "../../types/NotificationType";


export class NotificationService implements INotificationService {
    constructor(
        private _notificationRepository: INotificationRepository
    ){}

    async sendNotification(data: CreateNotificationDTO): Promise<NotificationResponseDTO> {
            
      const response = await this._notificationRepository.createNotification({
        userId: data.userId,
        notificationType: data.notificationType,
        message: this.handleNotificationMessage(data.notificationType, data.message)
    })
      return {
          _id: String(response._id),
          notificationType: response.notificationType,
          message: response.message,
          createdAt: response.createdAt as Date
      }
    
    }

    private handleNotificationMessage(notificationType: NotificationTypesType, message: string) {
          switch (notificationType) {        
            case 'assignment':
              return `You have a new assignment: ${message}`
            case 'study_material':
              return `You have a new study material: ${message}`
            case 'message':
              return `You have a new assignment: ${message}`
            case 'invoice':
              return `You have a new invoice: ${message}`
            default:
              throw new Error('Unsupported notification type');
          }
    }
    

    async fetchNotifications(userId: string): Promise<NotificationResponseDTO[]> {
        const response = await this._notificationRepository.findNotifications(userId)

        const notifications: NotificationResponseDTO[] = response.map((notification: NotificationEntityType) => {
            return {
             _id: String(notification._id),
             notificationType: notification.notificationType,
             message: notification.message,
             createdAt: notification.createdAt as Date
            }
        })

        return notifications
    }
      
}