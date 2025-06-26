import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { addBookToShelf } from "../firebase/firestoreHelpers";

const SearchBooks = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [addingState, setAddingState] = useState({}); // ✅ Track added status

  const searchBooks = async (e) => {
    e.preventDefault();
    if (!query) return;
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
      );
      setResults(response.data.items || []);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  const handleAdd = async (book, shelf) => {
    const key = `${book.id}-${shelf}`;
    const bookData = {
      googleId: book.id,
      title: book.volumeInfo.title || "Untitled",
      author: book.volumeInfo.authors?.[0] || "Unknown",
      thumbnail:
        book.volumeInfo.imageLinks?.thumbnail ||
        "https://via.placeholder.com/128x193?text=No+Cover",
    };

    try {
      await addBookToShelf(user, bookData, shelf);
      setAddingState((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setAddingState((prev) => ({ ...prev, [key]: false }));
      }, 1500);
    } catch (err) {
      console.error("Error adding book:", err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-2xl font-bold mb-4 text-purple-400">🔍 Search Books</h1>
      <form onSubmit={searchBooks} className="mb-6 flex gap-2">
        <input
          type="text"
          value={query}
          placeholder="Search by title, author..."
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 bg-zinc-800 text-white border border-zinc-600 placeholder-zinc-500 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded transition">
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((book) => {
          const info = book.volumeInfo;
          const id = book.id;

          return (
            <div key={id} className="bg-zinc-900 shadow rounded p-4">
              <img
                src={
                  info.imageLinks?.thumbnail ||
                  "https://via.placeholder.com/128x193?text=No+Cover"
                }
                alt={info.title}
                className="h-48 object-cover mb-2 mx-auto"
              />
              <h2 className="text-lg font-semibold text-purple-300">{info.title}</h2>
              <p className="text-sm text-zinc-400">
                {info.authors?.join(", ") || "Unknown"}
              </p>

              <div className="mt-3 space-y-1">
                {["reading", "read", "wishlist"].map((shelf) => {
                  const key = `${id}-${shelf}`;
                  const labelMap = {
                    reading: "Reading",
                    read: "Read",
                    wishlist: "Wishlist",
                  };
                  const colorMap = {
                    reading: "bg-yellow-500",
                    read: "bg-green-600",
                    wishlist: "bg-purple-600",
                  };

                  return (
                    <button
                      key={shelf}
                      onClick={() => handleAdd(book, shelf)}
                      className={`${colorMap[shelf]} w-full text-white px-3 py-1 rounded transition`}
                      disabled={addingState[key]}
                    >
                      {addingState[key] ? "✔️ Added" : `Add to ${labelMap[shelf]}`}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchBooks;
