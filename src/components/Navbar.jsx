import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState({ displayName: "", avatar: "", email: "" });
  const [hover, setHover] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [editing, setEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState("");

  const dropdownRef = useRef();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const data = snap.exists() ? snap.data() : {};
      setUserData({
        displayName: data.displayName || user.email,
        avatar: data.avatar || "",
        email: user.email,
      });
    };
    fetchProfile();
  }, [user]);

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const logout = async () => {
    await auth.signOut();
    navigate("/");
  };

  const saveAvatar = async () => {
    if (!user?.uid || !newAvatar) return;
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, { ...userData, avatar: newAvatar }, { merge: true });
    setUserData((prev) => ({ ...prev, avatar: newAvatar }));
    setEditing(false);
  };

  const defaultAvatar =
    "https://ui-avatars.com/api/?name=" +
    encodeURIComponent(userData.displayName || "User") +
    "&background=8b5cf6&color=fff&bold=true";

  return (
    <nav className="bg-zinc-900 shadow-md px-6 py-4 flex justify-between items-center relative">
      <Link to="/dashboard">
        <div className="text-2xl font-bold text-purple-400">📚 BookVerse</div>
      </Link>

      <div className="flex items-center space-x-6">
        <Link to="/dashboard" className="text-zinc-300 hover:text-purple-400">Dashboard</Link>
        <Link to="/search" className="text-zinc-300 hover:text-cyan-400">Search</Link>
        <Link to="/friends" className="text-zinc-300 hover:text-indigo-400">Friends</Link>

        {/* Avatar & Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          ref={dropdownRef}
        >
          <img
            src={userData.avatar || defaultAvatar}
            alt="Avatar"
            className="w-9 h-9 rounded-full border-2 border-purple-500 cursor-pointer"
          />

          <AnimatePresence>
            {hover && (
              <motion.div
                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-64 bg-zinc-800 text-white rounded-lg shadow-lg z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-zinc-700">
                  <p className="font-semibold text-base text-purple-300 break-words leading-tight">
                    {userData.displayName}
                  </p>
                  <p className="text-sm text-zinc-400 break-words">{userData.email}</p>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 transition"
                >
                  ✏️ Edit Avatar
                </button>
                <Link
                  to="/profile"
                  onClick={() => setHover(false)}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 transition"
                >
                  ⚙️ Settings
                </Link>
                <button
                  onClick={toggleTheme}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-700 transition"
                >
                  🌓 Toggle Theme
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white transition"
                >
                  🚪 Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Avatar Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-zinc-900 p-6 rounded shadow-lg max-w-sm w-full text-white space-y-4">
            <h2 className="text-lg font-bold text-purple-400">Update Avatar</h2>
            <input
              type="text"
              placeholder="Paste image URL"
              value={newAvatar}
              onChange={(e) => setNewAvatar(e.target.value)}
              className="w-full p-2 bg-zinc-800 text-white border border-zinc-700 rounded"
            />
            <div className="flex justify-end space-x-3">
              <button onClick={() => setEditing(false)} className="text-zinc-400 hover:text-white">
                Cancel
              </button>
              <button
                onClick={saveAvatar}
                className="bg-purple-600 hover:bg-purple-500 px-4 py-1 rounded text-white font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
