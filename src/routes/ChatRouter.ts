import { Router } from "express"
import ChatController from "../controllers/implementation/ChatController"
import ConversationRepository from "../repositories/implementaion/ConversationRepository"
import ChatService from "../services/implementation/ChatService"
import { protectRoute } from "../middlewares/AuthHandler"
import MessageRepository from "../repositories/implementaion/MessageRepository"

const chatService = new ChatService(ConversationRepository, MessageRepository)

const chatController = new ChatController(chatService)

const chatRouter = Router() 


chatRouter.get("/conversations/:subjectId", protectRoute(["teacher"]), chatController.fetchConversationsBySubjects.bind(chatController))
chatRouter.get("/conversations", protectRoute(["teacher", "student"]), chatController.fetchConversationsByParticipant.bind(chatController))
chatRouter.post('/conversation',  protectRoute(["teacher"]), chatController.createConversation.bind(chatController))
chatRouter.post('/message',  protectRoute(["teacher"]), chatController.createMessage.bind(chatController))
chatRouter.get('/messages/:conversationId',  protectRoute(["teacher"]), chatController.fetchMessagesByConversation.bind(chatController))


export default chatRouter