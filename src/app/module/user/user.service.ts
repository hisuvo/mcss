import { AppError } from "../../errorHelper/AppError";
import { prisma } from "../../lib/prisma";
import { CreateUserPayload } from "./user.interface";

const createUsers = async (payload: CreateUserPayload) => {
  if (!payload.name) {
    throw AppError(404, "User name and email is required");
  }

  const result = await prisma.user.create({
    data: payload,
  });
  return result;
};

const gerUsers = async () => {
  const user = await prisma.user.findMany();

  if (!user) {
    throw AppError(404, "User not found", "");
  }

  return user;
};

export const UserServices = {
  createUsers,
  gerUsers,
};
