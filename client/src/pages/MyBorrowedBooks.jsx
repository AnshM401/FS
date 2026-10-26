
import { useLibrary } from "../context/LibraryContext";

function MyBorrowedBooks() {
  const { books, returnBook } = useLibrary();

  const borrowedBooks = books.filter(
    (book) => book.status === "Borrowed"
  );

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-12">
      <div className="mx-auto max-w-7xl">

        <h1 className="text-3xl font-bold text-slate-900">
          My Borrowed Books
        </h1>

        <p className="mt-2 text-slate-600">
          Manage the books you have borrowed from the library.
        </p>

        <p className="mt-4 font-medium text-indigo-600">
          {borrowedBooks.length} borrowed book(s)
        </p>

        {borrowedBooks.length === 0 ? (
          <div className="mt-8 rounded-xl bg-white p-8 text-center shadow">
            <p className="text-lg text-slate-700">
              You haven't borrowed any books yet.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

            {borrowedBooks.map((book) => (
              <div
                key={book.isbn}
                className="rounded-xl bg-white p-6 shadow-md"
              >
                <div className="flex h-32 items-center justify-center rounded-lg bg-indigo-100">
                  <span className="text-5xl">📚</span>
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-800">
                  {book.title}
                </h2>

                <p className="mt-2 text-slate-600">
                  {book.author}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  ISBN: {book.isbn}
                </p>

                <span className="mt-4 inline-block rounded-full bg-red-100 px-3 py-1 text-sm text-red-700">
                  Borrowed
                </span>

                <button
                  onClick={() => returnBook(book.isbn)}
                  className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                  Return Book
                </button>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default MyBorrowedBooks;
