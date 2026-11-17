
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getBooks } from "../services/api";
import {
  borrowBookById,
  returnBookById,
} from "../services/borrowApi";

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      try {
        setLoading(true);
        setError("");

        const data = await getBooks();

        if (active) {
          setBooks(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBooks();

    return () => {
      active = false;
    };
  }, []);

  const changeBookStatus = async (isbn, action) => {
    const currentBook = books.find(
      (book) => book.isbn === isbn
    );

    if (!currentBook) return null;

    try {
      setError("");

      const updatedBook =
        action === "borrow"
          ? await borrowBookById(currentBook._id)
          : await returnBookById(currentBook._id);

      setBooks((currentBooks) =>
        currentBooks.map((book) =>
          book._id === updatedBook._id
            ? updatedBook
            : book
        )
      );

      return updatedBook;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const borrowBook = (isbn) =>
    changeBookStatus(isbn, "borrow");

  const returnBook = (isbn) =>
    changeBookStatus(isbn, "return");

  return (
    <LibraryContext.Provider
      value={{
        books,
        loading,
        error,
        borrowBook,
        returnBook,
      }}
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
