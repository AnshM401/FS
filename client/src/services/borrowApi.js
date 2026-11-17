
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

async function updateBorrowing(bookId, action) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in first");
  }

  const response = await fetch(
    `${BASE_URL}/api/books/${bookId}/${action}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to update book"
    );
  }

  return data.book;
}

export const borrowBookById = (bookId) =>
  updateBorrowing(bookId, "borrow");

export const returnBookById = (bookId) =>
  updateBorrowing(bookId, "return");
