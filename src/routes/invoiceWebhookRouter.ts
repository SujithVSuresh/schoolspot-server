import InvoiceRepository from "../repositories/implementaion/InvoiceRepository"
import { InvoiceService } from "../services/implementation/InvoiceService"
import { InvoiceController } from "../controllers/implementation/InvoiceController"
import { Router } from "express"
import express from 'express'
import PaymentRepository from "../repositories/implementaion/PaymentRepository"
// import { NotificationService } from "../services/implementation/NotificationService"
// import NotificationRepository from "../repositories/implementaion/NotificationRepository"
// import UserNotificationRepository from "../repositories/implementaion/UserNotificationRepository"


const invoiceService = new InvoiceService(InvoiceRepository, PaymentRepository)

const invoiceController = new InvoiceController(invoiceService)

const invoiceWebhookRouter = Router()


invoiceWebhookRouter.post('/webhook', express.raw({ type: 'application/json' }), invoiceController.stripeWebhookHandler.bind(invoiceController));


export default invoiceWebhookRouter