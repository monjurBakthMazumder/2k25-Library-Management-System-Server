"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_1 = __importDefault(require("./app/middlewares/errorHandler"));
const book_controller_1 = require("./app/Controller/book.controller");
const borrow_controller_1 = require("./app/Controller/borrow.controller");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use("/api/books", book_controller_1.bookRoutes);
app.use("/api/borrow", borrow_controller_1.borrowRoutes);
app.get("/", (req, res) => {
    res.send("Welcome to libary");
});
app.use(errorHandler_1.default);
app.use((req, res, next) => {
    res.status(404).json({
        message: "API endpoint not found",
        success: false,
        error: {
            path: req.originalUrl,
            method: req.method,
        },
    });
});
exports.default = app;
