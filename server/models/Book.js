const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    author: {
      type: String,
      required: true
    },

    isbn: {
      type: String,
      required: true,
      unique: true
    },

    status: {
      type: String,
      enum: ["Available", "Borrowed"],
      default: "Available"
    },

    borrowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);