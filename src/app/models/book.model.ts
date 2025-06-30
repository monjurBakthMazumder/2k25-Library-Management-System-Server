import { Schema, model } from "mongoose";
import { IBook } from "../Interface/book.interface";

const bookSchema = new Schema<IBook>(
  {
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
  },
  {
    timestamps: true,
  }
);

bookSchema.pre("save", function (next) {
  this.available = this.copies > 0;
  next();
});

bookSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as any;
  if (update && update.copies !== undefined) {
    update.available = update.copies > 0;
  }
  next();
});

export const Book = model<IBook>("Book", bookSchema);
