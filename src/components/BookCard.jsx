import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    const fetchRating = async () => {
        const bookId = book?.googleId || book?.id;

      if (!bookId) {
        console.warn("⚠️ Skipping rating fetch — bookId is undefined.");
        return;
      }

      try {
        const q = query(
          collection(db, "reviews"),
          where("bookId", "==", bookId)
        );
        const snapshot = await getDocs(q);
        const reviews = snapshot.docs.map((doc) => doc.data());

        if (reviews.length > 0) {
          const total = reviews.reduce((sum, r) => sum + r.rating, 0);
          setAvgRating((total / reviews.length).toFixed(1));
        }
      } catch (err) {
        console.error("🔥 Failed to fetch reviews in BookCard:", err);
      }
    };

    fetchRating();
  }, [book]);

  const openDetails = () => {
    navigate(`/book/${book.googleId || book.id}`, {
  state: { book },
});

  };

  return (
    <div
      onClick={openDetails}
      className="bg-zinc-900 text-white shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer rounded p-4 flex flex-col transition"
    >
      <img
        src={book.thumbnail}
        alt={book.title}
        className="h-48 object-cover mb-3 rounded"
      />
      <h2 className="text-lg font-bold text-purple-400">{book.title}</h2>
      <p className="text-sm text-zinc-400">{book.author}</p>
      <p className="text-xs mt-1 text-zinc-500 italic">Shelf: {book.shelf}</p>

      {avgRating && (
        <p className="text-yellow-400 mt-2 text-sm font-medium">
          ★ {avgRating} / 5
        </p>
      )}
    </div>
  );
};

export default BookCard;
