import status from "http-status";
import { AppError } from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import crypto from "crypto";
import fs from "fs";
import { UploadInput } from "./file.interface";

const uploadFile = async (data: UploadInput) => {
  return await prisma.$transaction(async (tx) => {
    // Get user with lock-safe transaction
    const user = await tx.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) throw AppError(status.NOT_FOUND, "User not found");

    // Convert bytes → MB
    const fileSizeMb = Math.ceil(data.fileSizeBytes / (1024 * 1024));

    // Storage limit check
    if (user.storageUsedMb + fileSizeMb > user.storageLimitMb) {
      throw AppError(
        status.REQUEST_ENTITY_TOO_LARGE,
        "Storage limit exceeded ",
      );
    }

    // Duplicate file name check (only active files)
    const existing = await tx.userFile.findFirst({
      where: {
        userId: data.userId,
        fileName: data.fileName,
        isDeleted: false,
      },
    });

    if (existing) {
      throw AppError(status.CONFLICT, "File name already exists");
    }

    // Generate file hash
    const buffer = fs.readFileSync(data.filePath);

    const fileHash = crypto.createHash("sha256").update(buffer).digest("hex");

    // Deduplicated file record
    let file = await tx.file.findUnique({
      where: { fileHash },
    });

    if (!file) {
      file = await tx.file.create({
        data: {
          fileHash,
          fileSize: data.fileSizeBytes,
        },
      });
    }

    // Create UserFile mapping
    const userFile = await tx.userFile.create({
      data: {
        userId: data.userId,
        fileId: file.id,
        fileName: data.fileName,
      },
    });

    // Update user storage
    await tx.user.update({
      where: { id: data.userId },
      data: {
        storageUsedMb: {
          increment: fileSizeMb,
        },
      },
    });

    return userFile;
  });
};

const deleteFile = async (data: { user_id: string; file_id: string }) => {
  return await prisma.$transaction(async (tx) => {
    const userFile = await tx.userFile.findFirst({
      where: {
        userId: data.user_id,
        fileId: data.file_id,
      },
      include: {
        file: true,
      },
    });

    if (!userFile) {
      throw AppError(status.NOT_FOUND, "Filed not found!");
    }

    // Convert bytes -> MB
    const fileSizeMb = Math.ceil(userFile.file.fileSize / (1024 * 1024));

    // Soft delete
    await tx.userFile.update({
      where: {
        id: userFile.id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // Reduce user Stroge
    await tx.user.update({
      where: {
        id: data.user_id,
      },
      data: {
        storageUsedMb: {
          decrement: fileSizeMb,
        },
      },
    });

    return { deletedFileId: userFile.id };
  });
};

const getStorageSummary = async (user_id: string) => {
  return await prisma.$transaction(async (tx) => {
    // Get user
    const user = await tx.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      throw AppError(status.NOT_FOUND, "User not found!");
    }

    // Count remaining storage
    const remainingStorageMb = user.storageLimitMb - user.storageUsedMb;

    // Count user file list
    const activeFileCount = await tx.userFile.count({
      where: {
        userId: user_id,
        isDeleted: false,
      },
    });

    return {
      storageLimitMb: user.storageLimitMb,
      storageUsedMb: user.storageUsedMb,
      remainingStorageMb,
      totalActiveFiles: activeFileCount,
    };
  });
};

const getUserFiles = async (user_id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
  });

  if (!user) {
    throw AppError(status.NOT_FOUND, "User not found!");
  }

  const userFiles = await prisma.userFile.findMany({
    where: {
      userId: user_id,
      isDeleted: false,
    },
    include: {
      file: true,
    },
    orderBy: {
      uploadTime: "desc",
    },
  });

  return userFiles.map((userfile) => ({
    fileId: userfile.id,
    fileName: userfile.fileName,
    fileSizeBytes: userfile.file.fileSize,
    uploadTime: userfile.uploadTime,
  }));
};

export const FileService = {
  uploadFile,
  deleteFile,
  getStorageSummary,
  getUserFiles,
};
