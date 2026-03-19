import { Router } from "express";
import { UserRoutes } from "../module/user/user.route";
import { FileRoutes } from "../module/file/file.route";

const router = Router();

router.use("/users", UserRoutes);
router.use("/users", FileRoutes);

export const IndexRoutes = router;
