/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { FileService } from "./file.service";
import { AppError } from "../../errorHelper/AppError";
import status from "http-status";

const uploadFile = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { userId } = req.params;

    if (!file) {
      throw AppError(status.BAD_REQUEST, "File is riquired");
    }

    const rawId = Array.isArray(userId) ? userId[0] : userId;

    const result = await FileService.uploadFile({
      userId: rawId,
      fileName: file.filename,
      fileSizeBytes: file.size,
      filePath: file.path,
    });

    res.status(status.CREATED).json({
      success: true,
      message: "file upload sucessfull",
      data: result,
    });
  } catch (error: any) {
    // next(error);
    res.status(status.NOT_FOUND).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};

const deleteFile = async (req: Request, res: Response) => {
  try {
    const { userId, fileId } = req.params;

    const user_id = Array.isArray(userId) ? userId[0] : userId;
    const file_id = Array.isArray(fileId) ? fileId[0] : fileId;

    if (!userId || !fileId) {
      throw AppError(status.BAD_REQUEST, "User ID and File ID required");
    }

    const result = await FileService.deleteFile({ user_id, file_id });

    res.status(status.OK).json({
      success: true,
      message: "Filed deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(status.NOT_FOUND).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};

const getStorageSummary = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user_id = Array.isArray(userId) ? userId[0] : userId;

    if (!userId) {
      throw AppError(status.BAD_REQUEST, "UserId is requried!");
    }

    const result = await FileService.getStorageSummary(user_id);

    res.status(status.OK).json({
      success: true,
      message: "Storage summary fetched",
      data: result,
    });
  } catch (error: any) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};

const getUserFiles = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user_id = Array.isArray(userId) ? userId[0] : userId;

    if (!userId) {
      throw AppError(status.BAD_REQUEST, "UserId is requried!");
    }

    const result = await FileService.getUserFiles(user_id);

    res.status(status.OK).json({
      success: true,
      message: "User files fetched",
      data: result,
    });
  } catch (error: any) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
};

export const FileController = {
  uploadFile,
  deleteFile,
  getStorageSummary,
  getUserFiles,
};

// import { Request, Response, NextFunction } from "express";
// import { FileService } from "./file.service";

// const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = req.params.userId;
//     // Assuming body structure aligns with new schema needs
//     const { fileName, fileSize, fileHash } = req.body;
//     const result = await FileService.uploadFile(userId as string, { fileName, fileSize, fileHash });
//     res.status(201).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = req.params.userId;
//     const fileId = req.params.fileId;
//     const result = await FileService.deleteFile(userId as string, fileId as string);
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// const getStorageSummary = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = req.params.userId;
//     const result = await FileService.getStorageSummary(userId as string);
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// const getUserFiles = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = req.params.userId;
//     const result = await FileService.getUserFiles(userId as string);
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// export const FileController = {
//   uploadFile,
//   deleteFile,
//   getStorageSummary,
//   getUserFiles,
// };
