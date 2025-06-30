import { Response } from "express";

interface ISendResponse<T> {
  res: Response;
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

const sendResponse = <T>({
  res,
  statusCode,
  success,
  message,
  data,
}: ISendResponse<T>): void => {
  res.status(statusCode).json({
    message,
    success,
    data,
  });
};

export default sendResponse;
