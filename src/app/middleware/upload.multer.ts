import { upload } from "../config/multer.config";

export const uploadSingle = upload.single("file");
export const uploadMultiple = upload.array("files", 5);
