function Modal({ book, onClose }) {
    if (!book) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
  
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
  
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
  
          <div className="mt-6 flex h-48 items-center justify-center rounded-xl bg-indigo-500">
            <span className="text-6xl">📚</span>
          </div>
  
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
            A classic book available in the library collection. Users will later
            be able to borrow this book through the backend API.
          </p>
  
          <button
            className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Borrow Book
          </button>
  
        </div>
      </div>
    );
  }
  
  export default Modal;