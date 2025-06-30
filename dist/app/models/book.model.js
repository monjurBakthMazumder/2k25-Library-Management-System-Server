"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
        type: String,
        enum: [
            "FICTION",
            "NON_FICTION",
            "SCIENCE",
            "HISTORY",
            "BIOGRAPHY",
            "FANTASY",
        ],
        required: true,
    },
    isbn: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    copies: { type: Number, required: true, min: 0, default: 0 },
    available: { type: Boolean, default: true },
}, {
    timestamps: true,
});
bookSchema.pre("save", function (next) {
    this.available = this.copies > 0;
    next();
});
bookSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update && update.copies !== undefined) {
        update.available = update.copies > 0;
    }
    next();
});
exports.Book = (0, mongoose_1.model)("Book", bookSchema);
