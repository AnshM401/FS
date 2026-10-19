
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const LibraryContext = createContext(null);

const initialBooks = [
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

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState(() => {
    try {
      const savedBooks = localStorage.getItem("library-books");
      return savedBooks ? JSON.parse(savedBooks) : initialBooks;
    } catch {
      return initialBooks;
    }
  });

  // Save book changes so they survive a page refresh.
  useEffect(() => {
    localStorage.setItem("library-books", JSON.stringify(books));
  }, [books]);

  // Borrow an available book.
  const borrowBook = (isbn) => {
    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.isbn === isbn && book.status === "Available"
          ? { ...book, status: "Borrowed" }
          : book
      )
    );
  };

  // Return a borrowed book.
  const returnBook = (isbn) => {
    setBooks((currentBooks) =>
      currentBooks.map((book) =>
        book.isbn === isbn && book.status === "Borrowed"
          ? { ...book, status: "Available" }
          : book
      )
    );
  };

  return (
    <LibraryContext.Provider
      value={{ books, borrowBook, returnBook }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);

  if (!context) {
    throw new Error(
      "useLibrary must be used inside LibraryProvider"
    );
  }

  return context;
}
