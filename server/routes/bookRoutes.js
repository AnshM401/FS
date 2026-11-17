
const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Book");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// GET: Retrieve all books
router.get("/", async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
});

// GET: Retrieve one book using MongoDB ID
router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid book ID",
      });
    }

    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
});

// POST: Create a new book
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      status = "Available",
    } = req.body;

    if (
      typeof title !== "string" || !title.trim() ||
      typeof author !== "string" || !author.trim() ||
      typeof isbn !== "string" || !isbn.trim()
    ) {
      return res.status(400).json({
        message: "Title, author, and ISBN are required",
      });
    }

    if (!["Available", "Borrowed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid book status",
      });
    }

    const newBook = await Book.create({
      title,
      author,
      isbn,
      status,
    });
    // Send real-time notification to connected users
req.app.get("io").emit("bookNotification", {
  message: `New book added: ${newBook.title}`,
});

    res.status(201).json({
      message: "Book added successfully",
      book: newBook,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A book with this ISBN already exists",
      });
    }

    next(error);
  }
});


 // PATCH: Borrow an available book
router.patch("/:id/borrow", protect, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid book ID"
      });
    }

    const book = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "Available"
      },
      {
        $set: {
          status: "Borrowed",
          borrowedBy: req.user._id
        }
      },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(409).json({
        message: "Book not found or already borrowed"
      });
    }

    res.status(200).json({
      message: "Book borrowed successfully",
      book
    });
  } catch (error) {
    next(error);
  }
});

// PATCH: Return a book borrowed by this user
router.patch("/:id/return", protect, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid book ID"
      });
    }

    const book = await Book.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "Borrowed",
        borrowedBy: req.user._id
      },
      {
        $set: {
          status: "Available",
          borrowedBy: null
        }
      },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(403).json({
        message: "Book cannot be returned by this user"
      });
    }

    res.status(200).json({
      message: "Book returned successfully",
      book
    });
  } catch (error) {
    next(error);
  }
});

// PUT: Update a book using MongoDB ID
router.put("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid book ID",
      });
    }

    const { title, author, status } = req.body;

    if (
      typeof title !== "string" || !title.trim() ||
      typeof author !== "string" || !author.trim() ||
      !["Available", "Borrowed"].includes(status)
    ) {
      return res.status(400).json({
        message: "Valid title, author, and status are required",
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        author: author.trim(),
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

req.app.get("io").emit("bookNotification", {
  message: `Book updated: ${updatedBook.title}`,
});

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE: Delete a book using MongoDB ID

router.delete("/:id", protect, adminOnly, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid book ID",
      });
    }

    const deletedBook = await Book.findByIdAndDelete(
      req.params.id
    );

    if (!deletedBook) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

req.app.get("io").emit("bookNotification", {
  message: `Book deleted: ${deletedBook.title}`,
});

    res.status(200).json({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    next(error);
  }
});


module.exports = router;