import { INotificationRepository } from "../../repositories/interface/INotificationRepository";
import { NotificationEntityType } from "../../types/NotificationType";
import { INotificationService } from "../interface/INotificationService";
import { CreateNotificationDTO, NotificationResponseDTO } from "../../dto/NotificationDTO";



export class NotificationService implements INotificationService {
    constructor(
        private _notificationRepository: INotificationRepository
    ){}

    async sendNotification(data: CreateNotificationDTO): Promise<NotificationResponseDTO> {
        switch (data.notificationType) {        
            case 'assignment':
              const response = await this.handleAssignmentNotification(data);
              return {
                _id: String(response._id),
                notificationType: response.notificationType,
                message: response.message,
                createdAt: response.createdAt as Date
              }
            case 'study_material':
              const studyMaterialResponse = await this.handleStudyMaterialNotification(data);
              return {
                  _id: String(studyMaterialResponse._id),
                  notificationType: studyMaterialResponse.notificationType,
                  message: studyMaterialResponse.message,
                  createdAt: studyMaterialResponse.createdAt as Date
              }
            case 'message':
              const messageResponse = await this.handleMessageNotification(data);
               return {
                   _id: String(messageResponse._id),
                   notificationType: messageResponse.notificationType,
                   message: messageResponse.message,
                   createdAt: messageResponse.createdAt as Date
            }
        
            default:
              throw new Error('Unsupported notification type');
          }
    }
    
      
    private async handleAssignmentNotification(data: CreateNotificationDTO) {
      return this._notificationRepository.createNotification({
        userId: data.userId,
        notificationType: data.notificationType as "message" | "study_material" | "assignment",
        message: `You have a new assignment: ${data.message}`
    })
    }

    private async handleStudyMaterialNotification(data: CreateNotificationDTO) {
        return this._notificationRepository.createNotification({
          userId: data.userId,
          notificationType: data.notificationType as "message" | "study_material" | "assignment",
          message: `You have a new study material: ${data.message}`
      })
      }

      private async handleMessageNotification(data: CreateNotificationDTO) {
        return this._notificationRepository.createNotification({
          userId: data.userId,
          notificationType: data.notificationType as "message" | "study_material" | "assignment",
          message: `You have a new message: ${data.message}`
      })
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