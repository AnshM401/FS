
import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const loadBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/books`);

      if (!response.ok) {
        throw new Error("Failed to load books");
      }

      setBooks(await response.json());
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setIsbn("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const existingBook = books.find(
        (book) => book._id === editingId
      );

      const url = editingId
        ? `${API_URL}/api/books/${editingId}`
        : `${API_URL}/api/books`;

      const body = editingId
        ? {
            title,
            author,
            status: existingBook.status
          }
        : {
            title,
            author,
            isbn,
            status: "Available"
          };

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      setMessage(
        editingId
          ? "Book updated successfully!"
          : "Book added successfully!"
      );

      resetForm();
      await loadBooks();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setTitle(book.title);
    setAuthor(book.author);
    setIsbn(book.isbn);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (book) => {
    if (!window.confirm(`Delete "${book.title}"?`)) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/books/${book._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setMessage("Book deleted successfully!");
      await loadBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        <h1
          className="text-3xl font-bold"
          style={{ color: "#0f172a" }}
        >
          Library Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Manage the library collection
        </p>

        {message && (
          <p className="mt-5 rounded-lg bg-green-100 p-3 text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-5 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-xl bg-white p-6 shadow"
        >
          <h2
            className="text-xl font-bold"
            style={{ color: "#0f172a" }}
          >
            {editingId ? "Edit Book" : "Add New Book"}
          </h2>

          <input
            type="text"
            placeholder="Book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-lg border p-3 text-slate-900"
          />

          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="w-full rounded-lg border p-3 text-slate-900"
          />

          <input
            type="text"
            placeholder="ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
            disabled={Boolean(editingId)}
            className="w-full rounded-lg border p-3 text-slate-900 disabled:bg-slate-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingId
                ? "Update Book"
                : "Add Book"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-3 rounded-lg bg-slate-200 px-5 py-3 text-slate-900"
            >
              Cancel
            </button>
          )}
        </form>

        <h2
          className="mt-10 text-2xl font-bold"
          style={{ color: "#0f172a" }}
        >
          Manage Books ({books.length})
        </h2>

        <div className="mt-5 space-y-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-5 shadow"
            >
              <div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: "#0f172a" }}
                >
                  {book.title}
                </h3>

                <p className="text-slate-600">
                  {book.author}
                </p>

                <p className="text-sm text-slate-500">
                  ISBN: {book.isbn}
                </p>

                <p className="text-sm text-slate-600">
                  Status: {book.status}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(book)}
                  className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-white"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(book)}
                  className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
