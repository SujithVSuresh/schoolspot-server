import { Router } from "express"
import { NotificationController } from "../controllers/implementation/NotificationController"
import NotificationRepository from "../repositories/implementaion/NotificationRepository"
import { NotificationService } from "../services/implementation/NotificationService"
import { protectRoute } from "../middlewares/AuthHandler"


const notificationService = new NotificationService(NotificationRepository)

const notificationController = new NotificationController(notificationService)

const notificationRouter = Router()

notificationRouter.get('/', protectRoute(["student", "teacher"]), notificationController.fetchNotifications.bind(notificationController));
notificationRouter.patch('/clear', protectRoute(["student", "teacher", "admin"]), notificationController.clearNotification.bind(notificationController));
notificationRouter.patch('/:id/clear', protectRoute(["student", "teacher", "admin"]), notificationController.clearNotification.bind(notificationController));


export default notificationRouter