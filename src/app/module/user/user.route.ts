import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.get("/", UserController.gerUsers);
router.post("/", UserController.createUsers);

export const UserRoutes = router;
