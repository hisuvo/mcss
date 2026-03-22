import express from "express";
import { uploadSingle } from "../../middleware/upload.multer";
import { FileController } from "./file.controller";

const router = express.Router();

router.post("/:userId/files", uploadSingle, FileController.uploadFile);
router.delete("/:userId/files/:fileId", FileController.deleteFile);
router.get("/:userId/storage-summary", FileController.getStorageSummary);
router.get("/:userId/files", FileController.getUserFiles);

export const FileRoutes = router;
