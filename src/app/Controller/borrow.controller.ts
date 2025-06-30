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
        res.status(404).json({
          success: false,
          message: "Book not found",
          error: { book: bookId },
        });
        return;
      }

      if (quantity <= 0) {
        res.status(400).json({
          success: false,
          message: "Quantity must be positive",
          error: { quantity },
        });
        return;
      }

      if (book.copies < quantity) {
        res.status(400).json({
          success: false,
          message: "Not enough copies available",
          error: { availableCopies: book.copies },
        });
        return;
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


