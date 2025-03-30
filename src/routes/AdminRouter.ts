import { Router } from "express";
import AdminRepository from "../repositories/implementaion/AdminRepository";
import { AdminService } from "../services/implementation/AdminService";
import { AdminController } from "../controllers/implementation/AdminController";
import { protectRoute } from "../middlewares/AuthHandler";


const adminService = new AdminService(AdminRepository);

const adminController = new AdminController(adminService);

const adminRouter = Router();


adminRouter.get("/admin-profile", protectRoute('admin'), adminController.getAdminProfile.bind(adminController));

export default adminRouter