import { NextFunction, Request, Response } from "express";
import { insertUser } from "../db/services/users";
import { IRequestBody } from "../types/requestBody";

export const userLogger = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const body: IRequestBody = req.body;
  await insertUser({
    IP: req.ip,
    timestamp: new Date(Date.now()),
    action: `Change ${body?.amt.toString()} ${body?.ccy_from.toString()} to ${body?.ccy_to.toString()}`,
  });
  next();
};
