import { Request, Response } from "express";
import { UserServices } from "./user.service";
import { AppError } from "../../errorHelper/AppError";
import status from "http-status";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.createUsers(req.body);

    res.status(200).json({
      success: true,
      message: "User create success",
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw AppError(500, error.message);
  }
};

const gerUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.gerUsers();

    console.log(status[400]);

    res.status(status.CREATED).json({
      success: true,
      message: "User retrive success",
      data: result,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw AppError(status.NOT_FOUND, error.message);
  }
};

export const UserController = {
  createUser,
  gerUsers,
};
