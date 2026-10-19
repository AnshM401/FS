
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { LibraryProvider } from "./context/LibraryContext";

function App() {
  return (
    <BrowserRouter>
      <LibraryProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </LibraryProvider>
    </BrowserRouter>
  );
}

export default App;
