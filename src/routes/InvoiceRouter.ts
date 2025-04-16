import InvoiceRepository from "../repositories/implementaion/InvoiceRepository"
import StudentRepository from "../repositories/implementaion/StudentRepository"
import { InvoiceService } from "../services/implementation/InvoiceService"
import { InvoiceController } from "../controllers/implementation/InvoiceController"
import { Router } from "express"
import { protectRoute } from "../middlewares/AuthHandler"

const invoiceService = new InvoiceService(InvoiceRepository, StudentRepository)

const invoiceController = new InvoiceController(invoiceService)

const invoiceRouter = Router()


invoiceRouter.post('/', protectRoute(["admin"]), invoiceController.createInvoice.bind(invoiceController));
invoiceRouter.get('/class/:classId', protectRoute(["student", "admin"]), invoiceController.findInvoicesByClassId.bind(invoiceController));
invoiceRouter.get('/student', protectRoute(["student"]), invoiceController.findInvoicesByStudentId.bind(invoiceController));



export default invoiceRouter