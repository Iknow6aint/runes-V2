import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();
const userController = new UserController();

router.post("/", userController.createUser.bind(userController));
router.get("/", userController.getUsers.bind(userController));

export default router;
