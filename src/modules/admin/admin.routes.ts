import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();
const adminController = new AdminController();

router.post("/", adminController.createAdmin.bind(adminController));
router.get("/", adminController.getAdmins.bind(adminController));

export default router;
