import { Request, Response, NextFunction, Router } from "express";
import sendResponse from "../utils/sendResponse";
import { Book } from "../models/book.model";

export const bookRoutes = Router();

bookRoutes.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await Book.create(req.body);
      sendResponse({
        res,
        statusCode: 201,
        success: true,
        message: "Book created successfully",
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }
);

bookRoutes.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter: any = {};
    if (req.query.filter) {
      filter.genre = req.query.filter;
    }

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sort === "asc" ? 1 : -1;
    const limit = Number(req.query.limit) || 10;

    const books = await Book.find(filter)
      .sort({ [sortBy as string]: sortOrder })
      .limit(limit);

    sendResponse({
      res,
      statusCode: 200,
      success: true,
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    next(error);
  }
});

bookRoutes.get(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await Book.findById(req.params.bookId);
      if (!book){
        return sendResponse({
          res,
          statusCode: 404,
          success: false,
          message: "Book not found",
          data: book,
        });
      }
        sendResponse({
          res,
          statusCode: 200,
          success: true,
          message: "Book retrieved successfully",
          data: book,
        });
    } catch (error) {
      next(error);
    }
  }
);

bookRoutes.put(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, {
        new: true,
        runValidators: true,
      });
      if (!book) {
        return sendResponse({
          res,
          statusCode: 404,
          success: false,
          message: "Book not found",
          data: book,
        });
      }

      sendResponse({
        res,
        statusCode: 200,
        success: true,
        message: "Book updated successfully",
        data: book,
      });
    } catch (error) {
      next(error);
    }
  }
);

bookRoutes.delete(
  "/:bookId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const book = await Book.findByIdAndDelete(req.params.bookId);
      if (!book) {
        return sendResponse({
          res,
          statusCode: 404,
          success: false,
          message: "Book not found",
          data: book,
        });
      }
      sendResponse({
        res,
        statusCode: 200,
        success: true,
        message: "Book deleted successfully",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }
);
