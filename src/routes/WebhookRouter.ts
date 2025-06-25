import { WebhookController } from "../controllers/implementation/WebhookController"
import { InvoiceService } from "../services/implementation/InvoiceService"
import { SubscriptionService } from "../services/implementation/SubscriptionService"
import PlanRepository from "../repositories/implementaion/PlanRepository"
import SubscriptionRepository from "../repositories/implementaion/SubscriptionRepository"
import PaymentRepository from "../repositories/implementaion/PaymentRepository"
import { Router } from "express"
// import { NotificationService } from "../services/implementation/NotificationService"
// import NotificationRepository from "../repositories/implementaion/NotificationRepository"
// import UserNotificationRepository from "../repositories/implementaion/UserNotificationRepository"
import InvoiceRepository from "../repositories/implementaion/InvoiceRepository"
import express from 'express'


const subscriptionService = new SubscriptionService(PlanRepository, SubscriptionRepository, PaymentRepository)

// const notificationService = new NotificationService(NotificationRepository, UserNotificationRepository)

const invoiceService = new InvoiceService(InvoiceRepository, PaymentRepository)


const webhookController = new WebhookController(invoiceService, subscriptionService)

const webhookRouter = Router()

webhookRouter.post('/handle-payment', express.raw({ type: 'application/json' }), webhookController.stripeWebhookHandler.bind(webhookController));


export default webhookRouter