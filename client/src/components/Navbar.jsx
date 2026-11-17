
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-4">

        <Link
          to="/"
          className="text-2xl font-bold text-white"
        >
          Library Management System
        </Link>

        <div className="flex flex-wrap items-center gap-6">

          <Link to="/" className="hover:text-indigo-400">
            Home
          </Link>

          <Link to="/books" className="hover:text-indigo-400">
            Books
          </Link>

          {user && (
            <Link
              to="/my-books"
              className="hover:text-indigo-400"
            >
              My Borrowed Books
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="hover:text-indigo-400"
            >
              Admin Dashboard
            </Link>
          )}

          {user ? (
            <>
              <span className="text-indigo-300">
                Hi, {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-indigo-400"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        <NotificationBell />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
