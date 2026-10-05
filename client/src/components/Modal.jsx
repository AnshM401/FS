function Modal({ book, onClose, onBorrow }) {
  if (!book) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            Book Details
          </h2>

          <button
            onClick={onClose}
            className="text-2xl font-bold text-slate-500 hover:text-red-500"
          >
            ×
          </button>
        </div>

        {/* Book Image */}
        <div className="mt-6 flex h-48 items-center justify-center rounded-xl bg-indigo-500">
          <span className="text-6xl">📚</span>
        </div>

        {/* Book Details */}
        <h3 className="mt-6 text-2xl font-bold text-slate-800">
          {book.title}
        </h3>

        <p className="mt-2 text-lg text-slate-600">
          {book.author}
        </p>

        <p className="mt-4 text-sm text-slate-500">
          ISBN: {book.isbn}
        </p>

        <p className="mt-2 text-slate-600">
          Status:{" "}
          <span
            className={
              book.status === "Available"
                ? "font-semibold text-green-600"
                : "font-semibold text-red-600"
            }
          >
            {book.status}
          </span>
        </p>

        <p className="mt-4 text-slate-600">
          A classic book available in the library collection.
          Users can borrow this book from the library.
        </p>

        {/* Borrow Button */}
        <button
          onClick={() => onBorrow(book)}
          disabled={book.status !== "Available"}
          className={`mt-6 w-full rounded-lg px-4 py-3 font-semibold text-white transition ${
            book.status === "Available"
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "cursor-not-allowed bg-slate-400"
          }`}
        >
          {book.status === "Available" ? "Borrow Book" : "Book Borrowed"}
        </button>

      </div>
    </div>
  );
}

export default Modal;