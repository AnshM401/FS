
import { useState } from "react";
import BookCard from "../components/bookcard";
import Modal from "../components/Modal";
import { useLibrary } from "../context/LibraryContext";

function Home() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [availability, setAvailability] = useState("All Books");

  const { books, borrowBook } = useLibrary();

  // Search books by title, author, or ISBN.
  const filteredBooks = books.filter((book) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search) ||
      book.isbn.toLowerCase().includes(search);

    const matchesAvailability =
      availability === "All Books" ||
      book.status === availability;

    return matchesSearch && matchesAvailability;
  });

  // Borrow a book using the shared Context state.
  const handleBorrow = (book) => {
    borrowBook(book.isbn);
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Heading */}
      <section className="px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
          Library Catalog
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          Browse our collection of books and find your next great read.
        </p>
      </section>

      {/* Search and Availability Filter */}
      <section className="px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row">

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, author, or ISBN..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 md:flex-1"
          />

          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-3"
          >
            <option>All Books</option>
            <option>Available</option>
            <option>Borrowed</option>
          </select>

        </div>
      </section>

      {/* Book Collection */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">

          <h2 className="text-2xl font-bold text-slate-900">
            {availability === "All Books"
              ? "Library Collection"
              : `${availability} Books`}
          </h2>

          <p className="mt-2 text-slate-600">
            {filteredBooks.length} book(s) found
          </p>

          {filteredBooks.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

              {filteredBooks.map((book) => (
                <BookCard
                  key={book.isbn}
                  {...book}
                  onView={() => setSelectedBook(book)}
                />
              ))}

            </div>
          ) : (
            <p className="mt-8 rounded-lg bg-white p-8 text-center text-slate-600 shadow">
              No books match your search. Try another title or filter.
            </p>
          )}

        </div>
      </section>

      {/* Pagination - visual placeholder for now */}
      <section className="pb-12 text-center">
        <button className="mx-1 rounded-lg bg-indigo-600 px-4 py-2 text-white">
          1
        </button>

        <button className="mx-1 rounded-lg bg-white px-4 py-2 shadow">
          2
        </button>

        <button className="mx-1 rounded-lg bg-white px-4 py-2 shadow">
          3
        </button>

        <button className="mx-1 rounded-lg bg-white px-4 py-2 shadow">
          Next
        </button>
      </section>

      {/* Book Details Modal */}
      <Modal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onBorrow={handleBorrow}
      />

    </div>
  );
}

export default Home;
