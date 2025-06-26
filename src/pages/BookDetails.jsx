import React from "react";
import { useLocation } from "react-router-dom";
import ReviewSection from "../components/ReviewSection";

const BookDetails = () => {
  const { state } = useLocation();
  const book = state?.book;

  if (!book) return <div className="text-center text-white">No book data found.</div>;

  const bookId = book.googleId || book.id || book.bookId;

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto bg-zinc-900 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={book.thumbnail}
            alt={book.title}
            className="w-40 h-auto rounded shadow"
          />
          <div>
            <h1 className="text-3xl font-bold text-purple-400 mb-2">
              {book.title}
            </h1>
            <p className="text-zinc-400 text-lg mb-4">{book.author}</p>
            <p className="text-sm text-zinc-300 italic">
              Shelf: {book.shelf || "N/A"}
            </p>
          </div>
        </div>

        {/* 🔥 Reviews Section */}
        <ReviewSection bookId={bookId} />
      </div>
    </div>
  );
};

export default BookDetails;
