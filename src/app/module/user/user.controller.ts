import { Request, Response } from "express";
import { UserServices } from "./user.service";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.createUsers(req.body);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User retrived successfully",
    data: result,
  });
});

const gerUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.gerUsers();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User retrived successfully",
    data: result,
  });
});

export const UserController = {
  createUsers,
  gerUsers,
};
