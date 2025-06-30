import { Request, Response, NextFunction } from "express";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err.name === "ValidationError") {
    const error: any = {};
    for (const key in err.errors) {
      const info = err.errors[key];
      error[key] = {
        message: info.message,
        name: info.name,
        properties: info.properties,
        kind: info.kind,
        path: info.path,
        value: info.value,
      };
    }

    res.status(400).json({
      message: "Validation failed",
      success: false,
      error: {
        name: err.name,
        errors: error,
      },
    });
    return;
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    success: false,
    error: err,
  });
};

export default globalErrorHandler;


