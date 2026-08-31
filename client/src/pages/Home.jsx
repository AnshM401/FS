import { useState } from "react";
import BookCard from "../components/bookcard";
import Modal from "../components/Modal";

function Home() {
  const [selectedBook, setSelectedBook] = useState(null);

  const books = [
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      status: "Available",
      isbn: "978-0743273565"
    },
    {
      title: "1984",
      author: "George Orwell",
      status: "Borrowed",
      isbn: "978-0451524935"
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      status: "Available",
      isbn: "978-0547928227"
    }
  ];

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

      {/* Search */}
      <section className="px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row">

          <input
            type="text"
            placeholder="Search books..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 md:flex-1"
          />

          <select className="rounded-lg border border-slate-300 bg-white px-4 py-3">
            <option>All Books</option>
            <option>Available</option>
            <option>Borrowed</option>
          </select>

        </div>
      </section>

      {/* Books */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">

          <h2 className="text-2xl font-bold text-slate-900">
            Available Books
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {books.map((book) => (
              <BookCard
                key={book.isbn}
                {...book}
                onView={() => setSelectedBook(book)}
              />
            ))}

          </div>
        </div>
      </section>

      {/* Pagination */}
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

      {/* Modal */}
      <Modal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
      />

    </div>
  );
}

export default Home;