import express, { Application, NextFunction, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/errorHandler";
import { bookRoutes } from "./app/Controller/book.controller";
import { borrowRoutes } from "./app/Controller/borrow.controller";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to libary");
});

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: "API endpoint not found",
    success: false,
    error: {
      path: req.originalUrl,
      method: req.method,
    },
  });
});

export default app;
