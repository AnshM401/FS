function BookCard({ title, author, status, isbn, onView }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">

      {/* Book Image / Icon */}
      <div className="flex h-48 items-center justify-center bg-indigo-500">
        <span className="text-5xl">📚</span>
      </div>

      {/* Book Information */}
      <div className="p-6">

        {/* Availability */}
        <span
          className={`rounded-full px-3 py-1 text-sm ${
            status === "Available"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>

        {/* Title */}
        <h2 className="mt-4 text-xl font-bold text-slate-800">
          {title}
        </h2>

        {/* Author */}
        <p className="mt-2 text-slate-600">
          {author}
        </p>

        {/* ISBN */}
        <p className="mt-3 text-sm text-slate-500">
          ISBN: {isbn}
        </p>

        {/* View Details */}
        <button
          onClick={onView}
          className="mt-5 w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700"
        >
          View Details
        </button>

      </div>
    </div>
  );
}

export default BookCard;