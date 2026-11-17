
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBorrowedBooks from "./pages/MyBorrowedBooks";
import AdminDashboard from "./pages/AdminDashboard";

import { LibraryProvider } from "./context/LibraryContext";
import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LibraryProvider>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route
              path="/register"
              element={<Register />}
            />

            <Route
              path="/my-books"
              element={
                <ProtectedRoute>
                  <MyBorrowedBooks />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </LibraryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
