/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { FileService } from "./file.service";
import { AppError } from "../../errorHelper/AppError";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const uploadFile = catchAsync(async (req: Request, res: Response) => {
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

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "file upload sucessfull",
    data: result,
  });
});

const deleteFile = catchAsync(async (req: Request, res: Response) => {
  const { userId, fileId } = req.params;

  const user_id = Array.isArray(userId) ? userId[0] : userId;
  const file_id = Array.isArray(fileId) ? fileId[0] : fileId;

  if (!userId || !fileId) {
    throw AppError(status.BAD_REQUEST, "User ID and File ID required");
  }

  const result = await FileService.deleteFile({ user_id, file_id });

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "File delete sucessfull",
    data: result,
  });
});

const getStorageSummary = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user_id = Array.isArray(userId) ? userId[0] : userId;

  if (!userId) {
    throw AppError(status.BAD_REQUEST, "UserId is requried!");
  }
  const result = await FileService.getStorageSummary(user_id);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "File storage summery retrived sucessfull",
    data: result,
  });
});

const getUserFiles = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user_id = Array.isArray(userId) ? userId[0] : userId;

  if (!userId) {
    throw AppError(status.BAD_REQUEST, "UserId is requried!");
  }
  const result = await FileService.getUserFiles(user_id);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Get user file sucessfull",
    data: result,
  });
});

export const FileController = {
  uploadFile,
  deleteFile,
  getStorageSummary,
  getUserFiles,
};
