
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Temporary book data for API testing.
// We will connect a database later.
let books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    status: "Available",
    isbn: "978-0743273565",
  },
  {
    title: "1984",
    author: "George Orwell",
    status: "Borrowed",
    isbn: "978-0451524935",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    status: "Available",
    isbn: "978-0547928227",
  },
];

// Check that the API is running
app.get("/", (req, res) => {
  res.json({ message: "Library Management API is running!" });
});

// GET: Retrieve all books
app.get("/api/books", (req, res) => {
  res.status(200).json(books);
});

// GET: Retrieve one book by ISBN
app.get("/api/books/:isbn", (req, res) => {
  const book = books.find(
    (item) => item.isbn === req.params.isbn
  );

  if (!book) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  res.status(200).json(book);
});

// POST: Add a new book
app.post("/api/books", (req, res) => {
  const { title, author, isbn, status = "Available" } = req.body;

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
      message: "Status must be Available or Borrowed",
    });
  }

  if (books.some((item) => item.isbn === isbn.trim())) {
    return res.status(409).json({
      message: "A book with this ISBN already exists",
    });
  }

  const newBook = {
    title: title.trim(),
    author: author.trim(),
    isbn: isbn.trim(),
    status,
  };

  books.push(newBook);

  res.status(201).json({
    message: "Book added successfully",
    book: newBook,
  });
});

// PUT: Update an existing book
app.put("/api/books/:isbn", (req, res) => {
  const bookIndex = books.findIndex(
    (item) => item.isbn === req.params.isbn
  );

  if (bookIndex === -1) {
    return res.status(404).json({
      message: "Book not found",
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

  books[bookIndex] = {
    ...books[bookIndex],
    title: title.trim(),
    author: author.trim(),
    status,
  };

  res.status(200).json({
    message: "Book updated successfully",
    book: books[bookIndex],
  });
});

// DELETE: Remove a book
app.delete("/api/books/:isbn", (req, res) => {
  const bookIndex = books.findIndex(
    (item) => item.isbn === req.params.isbn
  );

  if (bookIndex === -1) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  const deletedBook = books[bookIndex];

  books = books.filter(
    (item) => item.isbn !== req.params.isbn
  );

  res.status(200).json({
    message: "Book deleted successfully",
    book: deletedBook,
  });
});

// Handle unexpected server errors
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON request body",
    });
  }

  res.status(500).json({
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Library API running at http://localhost:${PORT}`);
});
