import { Router } from "express"
import { NotificationController } from "../controllers/implementation/NotificationController"
import NotificationRepository from "../repositories/implementaion/NotificationRepository"
import { NotificationService } from "../services/implementation/NotificationService"
import { protectRoute } from "../middlewares/AuthHandler"
import UserNotificationRepository from "../repositories/implementaion/UserNotificationRepository"


const notificationService = new NotificationService(NotificationRepository, UserNotificationRepository)

const notificationController = new NotificationController(notificationService)

const notificationRouter = Router()

notificationRouter.get('/', protectRoute(["student", "teacher"]), notificationController.fetchNotifications.bind(notificationController));
notificationRouter.patch('/:notificationId/clear', protectRoute(["student", "teacher", "admin"]), notificationController.clearNotification.bind(notificationController));
notificationRouter.patch('/clearAll', protectRoute(["student", "teacher", "admin"]), notificationController.clearAllNotifications.bind(notificationController));
notificationRouter.patch('/read', protectRoute(["student", "teacher", "admin"]), notificationController.setReadNotifications.bind(notificationController));


export default notificationRouter