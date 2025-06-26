import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SearchBooks from "./pages/SearchBooks";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import FriendProfile from "./pages/FriendProfile";
import BookDetails from "./pages/BookDetails";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black text-white font-sans">
          <Routes>
            {/* 🚫 No Navbar on Auth Pages */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ✅ Routes With Navbar */}
            <Route
              path="/dashboard"
              element={
                <>
                  <Navbar />
                  <Dashboard />
                </>
              }
            />
            <Route
              path="/search"
              element={
                <>
                  <Navbar />
                  <SearchBooks />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <>
                  <Navbar />
                  <Profile />
                </>
              }
            />
            <Route
              path="/friends"
              element={
                <>
                  <Navbar />
                  <Friends />
                </>
              }
            />
            <Route
              path="/friend/:uid"
              element={
                <>
                  <Navbar />
                  <FriendProfile />
                </>
              }
            />
            <Route
              path="/book/:id"
              element={
                <>
                  <Navbar />
                  <BookDetails />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
