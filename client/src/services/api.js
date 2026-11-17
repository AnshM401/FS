
const API_URL = "http://localhost:5000/api/books";

// GET: Fetch all books
export async function getBooks() {
  const response = await fetch(API_URL);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch books");
  }

  return data;
}

// PUT: Update a book using MongoDB ID
export async function updateBook(bookId, updatedData) {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(bookId)}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update book");
  }

  return data.book;
}
