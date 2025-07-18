"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoutes = void 0;
const express_1 = require("express");
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const book_model_1 = require("../models/book.model");
const borrow_model_1 = require("../models/borrow.model");
const zod_1 = require("zod");
exports.borrowRoutes = (0, express_1.Router)();
const borrowZodSchema = zod_1.z.object({
    book: zod_1.z.string({ required_error: "Book ID is required" }),
    quantity: zod_1.z
        .number({ required_error: "Quantity is required" })
        .int()
        .positive("Quantity must be a positive integer"),
    dueDate: zod_1.z.string({ required_error: "Due date is required" }),
});
exports.borrowRoutes.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { book: bookId, quantity, dueDate, } = yield borrowZodSchema.parseAsync(req.body);
        const book = yield book_model_1.Book.findById(bookId);
        if (!book) {
            return (0, sendResponse_1.default)({
                res,
                statusCode: 404,
                success: false,
                message: "Book not found",
                data: book,
            });
        }
        if (quantity <= 0) {
            return (0, sendResponse_1.default)({
                res,
                statusCode: 400,
                success: false,
                message: "Quantity must be positive",
                data: book,
            });
        }
        if (book.copies < quantity) {
            return (0, sendResponse_1.default)({
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
        yield book.save();
        const borrowRecord = yield borrow_model_1.Borrow.create({
            book: bookId,
            quantity,
            dueDate,
        });
        (0, sendResponse_1.default)({
            res,
            statusCode: 201,
            success: true,
            message: "Book borrowed successfully",
            data: borrowRecord,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.borrowRoutes.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.Borrow.aggregate([
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
        (0, sendResponse_1.default)({
            res,
            statusCode: 200,
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary,
        });
    }
    catch (error) {
        next(error);
    }
}));
