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
exports.bookRoutes = void 0;
const express_1 = require("express");
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
const book_model_1 = require("../models/book.model");
exports.bookRoutes = (0, express_1.Router)();
exports.bookRoutes.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.create(req.body);
        (0, sendResponse_1.default)({
            res,
            statusCode: 201,
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.bookRoutes.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = {};
        if (req.query.filter) {
            filter.genre = req.query.filter;
        }
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sort === "asc" ? 1 : -1;
        const limit = Number(req.query.limit) || 10;
        const books = yield book_model_1.Book.find(filter)
            .sort({ [sortBy]: sortOrder })
            .limit(limit);
        (0, sendResponse_1.default)({
            res,
            statusCode: 200,
            success: true,
            message: "Books retrieved successfully",
            data: books,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.bookRoutes.get("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.findById(req.params.bookId);
        if (!book) {
            return (0, sendResponse_1.default)({
                res,
                statusCode: 404,
                success: false,
                message: "Book not found",
                data: book,
            });
        }
        (0, sendResponse_1.default)({
            res,
            statusCode: 200,
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.bookRoutes.put("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.findByIdAndUpdate(req.params.bookId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!book) {
            return (0, sendResponse_1.default)({
                res,
                statusCode: 404,
                success: false,
                message: "Book not found",
                data: book,
            });
        }
        (0, sendResponse_1.default)({
            res,
            statusCode: 200,
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.bookRoutes.delete("/:bookId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.Book.findByIdAndDelete(req.params.bookId);
        if (!book) {
            return (0, sendResponse_1.default)({
                res,
                statusCode: 404,
                success: false,
                message: "Book not found",
                data: book,
            });
        }
        (0, sendResponse_1.default)({
            res,
            statusCode: 200,
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
}));
