import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import BookCard from "../components/BookCard";

const FriendProfile = () => {
  const { uid } = useParams();
  const [friend, setFriend] = useState(null);
  const [books, setBooks] = useState([]);
  const [shelf, setShelf] = useState("read");
  const [loadingBooks, setLoadingBooks] = useState(true);

  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setFriend({ uid, ...snap.data() });
        }
      } catch (err) {
        console.error("Error loading friend data:", err);
      }
    };
    fetchFriend();
  }, [uid]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!uid || !shelf) return;
      setLoadingBooks(true);
      try {
        const q = query(
          collection(db, "books"),
          where("uid", "==", uid),
          where("shelf", "==", shelf)
        );
        const snap = await getDocs(q);
        setBooks(snap.docs.map((doc) => doc.data()));
      } catch (err) {
        console.error("Error loading books:", err);
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchBooks();
  }, [uid, shelf]);

  if (!friend) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-purple-300 text-lg animate-pulse">
          Loading friend profile...
        </p>
      </div>
    );
  }

  const avatar = friend.avatar
    ? friend.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        friend.displayName || "User"
      )}&background=8b5cf6&color=fff&bold=true`;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto bg-zinc-900 p-6 rounded-lg shadow">
        {/* 👤 Header */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={avatar}
            className="w-16 h-16 rounded-full border-2 border-purple-500 shadow"
            alt="Friend Avatar"
          />
          <div>
            <h2 className="text-2xl font-bold text-purple-400">
              {friend.displayName}
            </h2>
            {friend.bio ? (
              <p className="text-zinc-400 text-sm mt-1">{friend.bio}</p>
            ) : (
              <p className="text-zinc-600 text-sm italic">No bio provided</p>
            )}
          </div>
        </div>

        {/* 🗂 Tabs */}
        <div className="flex space-x-3 mb-4">
          {["reading", "read", "wishlist"].map((tab) => (
            <button
              key={tab}
              onClick={() => setShelf(tab)}
              className={`px-4 py-2 rounded font-medium transition ${
                shelf === tab
                  ? "bg-purple-600 text-white"
                  : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* 📚 Books */}
        {loadingBooks ? (
          <p className="text-purple-300 animate-pulse">Loading books...</p>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {books.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 italic">
            No books in <span className="capitalize">{shelf}</span> shelf.
          </p>
        )}
      </div>
    </div>
  );
};

export default FriendProfile;
