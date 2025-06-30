import { Request, Response, NextFunction, Router } from "express";
import sendResponse from "../utils/sendResponse";
import { Book } from "../models/book.model";
import { Borrow } from "../models/borrow.model";
import { z } from "zod";

export const borrowRoutes = Router();

const borrowZodSchema = z.object({
  book: z.string({ required_error: "Book ID is required" }),
  quantity: z
    .number({ required_error: "Quantity is required" })
    .int()
    .positive("Quantity must be a positive integer"),
  dueDate: z.string({ required_error: "Due date is required" }),
});

borrowRoutes.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        book: bookId,
        quantity,
        dueDate,
      } = await borrowZodSchema.parseAsync(req.body);

      const book = await Book.findById(bookId);
      if (!book) {
        return sendResponse({
          res,
          statusCode: 404,
          success: false,
          message: "Book not found",
          data: book,
        });
      }

      if (quantity <= 0) {
        return sendResponse({
          res,
          statusCode: 400,
          success: false,
          message: "Quantity must be positive",
          data: book,
        });
      }

      if (book.copies < quantity) {
        return sendResponse({
          res,
          statusCode: 400,
          success: false,
          message: "Not enough copies available",
          data: book,
        });
      }

      book.copies -= quantity;
      if (book.copies === 0) {
        book.available = false;
      }
      await book.save();

      const borrowRecord = await Borrow.create({
        book: bookId,
        quantity,
        dueDate,
      });

      sendResponse({
        res,
        statusCode: 201,
        success: true,
        message: "Book borrowed successfully",
        data: borrowRecord,
      });
    } catch (error) {
      next(error);
    }
  }
);

borrowRoutes.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await Borrow.aggregate([
        {
          $group: {
            _id: "$book",
            totalQuantity: { $sum: "$quantity" },
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "_id",
            as: "bookDetails",
          },
        },
        {
          $unwind: "$bookDetails",
        },
        {
          $project: {
            _id: 0,
            book: {
              title: "$bookDetails.title",
              isbn: "$bookDetails.isbn",
            },
            totalQuantity: 1,
          },
        },
      ]);

      sendResponse({
        res,
        statusCode: 200,
        success: true,
        message: "Borrowed books summary retrieved successfully",
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }
);
