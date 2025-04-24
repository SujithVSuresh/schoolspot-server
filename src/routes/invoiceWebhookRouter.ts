import InvoiceRepository from "../repositories/implementaion/InvoiceRepository"
import StudentRepository from "../repositories/implementaion/StudentRepository"
import { InvoiceService } from "../services/implementation/InvoiceService"
import { InvoiceController } from "../controllers/implementation/InvoiceController"
import { Router } from "express"
import express from 'express'
import PaymentRepository from "../repositories/implementaion/PaymentRepository"

const invoiceService = new InvoiceService(InvoiceRepository, StudentRepository, PaymentRepository)

const invoiceController = new InvoiceController(invoiceService)

const invoiceWebhookRouter = Router()


invoiceWebhookRouter.post('/webhook', express.raw({ type: 'application/json' }), invoiceController.stripeWebhookHandler.bind(invoiceController));


export default invoiceWebhookRouter