import InvoiceRepository from "../repositories/implementaion/InvoiceRepository"
import StudentRepository from "../repositories/implementaion/StudentRepository"
import { InvoiceService } from "../services/implementation/InvoiceService"
import { InvoiceController } from "../controllers/implementation/InvoiceController"
import { Router } from "express"
import { protectRoute } from "../middlewares/AuthHandler"
import express from 'express'
import PaymentRepository from "../repositories/implementaion/PaymentRepository"

const invoiceService = new InvoiceService(InvoiceRepository, StudentRepository, PaymentRepository)

const invoiceController = new InvoiceController(invoiceService)

const invoiceRouter = Router()


invoiceRouter.post('/', protectRoute(["admin"]), invoiceController.createInvoice.bind(invoiceController));
invoiceRouter.get('/class/:classId', protectRoute(["student", "admin"]), invoiceController.findInvoicesByClassId.bind(invoiceController));
invoiceRouter.get('/student', protectRoute(["student"]), invoiceController.findInvoicesByStudentId.bind(invoiceController));
invoiceRouter.post('/invoice-session', protectRoute(["student"]), invoiceController.createInvoiceSession.bind(invoiceController));
invoiceRouter.post('/webhook', express.raw({ type: 'application/json' }), invoiceController.stripeWebhookHandler.bind(invoiceController));
invoiceRouter.get('/:invoiceId', protectRoute(["student"]), invoiceController.findInvoiceById.bind(invoiceController));
invoiceRouter.delete('/:invoiceId', protectRoute(["admin"]), invoiceController.deleteInvoice.bind(invoiceController));


export default invoiceRouter