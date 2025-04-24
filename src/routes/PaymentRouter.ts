import { PaymentController } from "../controllers/implementation/PaymentController";
import PaymentRepository from "../repositories/implementaion/PaymentRepository";
import { PaymentService } from "../services/implementation/PaymentService";
import { protectRoute } from "../middlewares/AuthHandler";
import { Router } from "express";

const paymentService = new PaymentService(PaymentRepository)

const paymentController = new PaymentController(paymentService)

const paymentRouter = Router()

paymentRouter.get('/invoice/:invoiceId', protectRoute(["student"]), paymentController.getPaymentsByInvoiceId.bind(paymentController));


export default paymentRouter