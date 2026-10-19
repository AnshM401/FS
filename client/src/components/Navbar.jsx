import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-900 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <h1 className="text-2xl font-bold text-white">
          Library Management System
        </h1>

        <div className="flex gap-6">
          <Link
            to="/"
            className="hover:text-indigo-400"
          >
            Home
          </Link>

          <Link
            to="/"
            className="hover:text-indigo-400"
          >
            Books
          </Link>

          <Link
            to="/login"
            className="hover:text-indigo-400"
          >
            Login
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;