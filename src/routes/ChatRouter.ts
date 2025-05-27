import { Router } from "express"
import ChatController from "../controllers/implementation/ChatController"
import ConversationRepository from "../repositories/implementaion/ConversationRepository"
import ChatService from "../services/implementation/ChatService"
import { protectRoute } from "../middlewares/AuthHandler"
import MessageRepository from "../repositories/implementaion/MessageRepository"
import UserRepository from "../repositories/implementaion/UserRepository"
import { NotificationService } from "../services/implementation/NotificationService"
import NotificationRepository from "../repositories/implementaion/NotificationRepository"
import {upload} from '../middlewares/UploadMiddleware'


const notificationService = new NotificationService(NotificationRepository)
const chatService = new ChatService(ConversationRepository, MessageRepository, UserRepository, notificationService)

const chatController = new ChatController(chatService)

const chatRouter = Router() 


chatRouter.get("/conversations/:subjectId", protectRoute(["teacher"]), chatController.fetchConversationsBySubjects.bind(chatController))
chatRouter.get("/conversations", protectRoute(["teacher", "student"]), chatController.fetchConversationsByParticipant.bind(chatController))
chatRouter.post('/conversation',  protectRoute(["teacher"]), chatController.createConversation.bind(chatController))
chatRouter.post('/conversation/:conversationId/delete',  protectRoute(["teacher"]), chatController.deleteConversation.bind(chatController))

chatRouter.post('/message',  protectRoute(["teacher", "student"]), upload.single("attachment"), chatController.createMessage.bind(chatController))
chatRouter.patch('/message/:messageId/delete',  protectRoute(["teacher", "student"]), chatController.deleteMessage.bind(chatController))
chatRouter.put('/conversation/:conversationId',  protectRoute(["teacher"]), chatController.updateConversation.bind(chatController))
chatRouter.get('/messages/:conversationId',  protectRoute(["teacher", "student"]), chatController.fetchMessagesByConversation.bind(chatController))


export default chatRouter