import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

const ReviewSection = ({ bookId }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const submitReview = async () => {
    if (!user?.uid) {
      alert("Please log in to submit a review.");
      return;
    }

    if (!comment || rating === 0) {
      alert("Please enter a comment and select a rating.");
      return;
    }

    try {
      await addDoc(collection(db, "reviews"), {
        bookId,
        uid: user.uid,
        user: user.displayName || user.email || "Anonymous",
        comment,
        rating,
        createdAt: serverTimestamp(),
      });
      setComment("");
      setRating(0);
      fetchReviews();
    } catch (err) {
      console.error("❌ Failed to submit review:", err);
    }
  };

  const fetchReviews = async () => {
    if (!bookId) return;

    try {
      const q = query(collection(db, "reviews"), where("bookId", "==", bookId));
      const snapshot = await getDocs(q);
      const result = snapshot.docs.map((doc) => doc.data());
      setReviews(result);
    } catch (err) {
      console.error("❌ Failed to fetch reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [bookId]);

  const yourReview = reviews.find((rev) => rev.uid === user?.uid);
  const others = reviews.filter((rev) => rev.uid !== user?.uid);

  return (
    <div className="bg-zinc-900 p-4 mt-6 rounded-lg shadow-md text-white">
      <h2 className="text-lg font-bold text-purple-400 mb-2">Leave a Review</h2>

      {!user ? (
        <p className="text-sm text-zinc-400 mb-2 italic">
          Please log in to leave a review.
        </p>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                onClick={() => setRating(i)}
                className={`cursor-pointer text-2xl ${
                  rating >= i ? "text-yellow-400" : "text-zinc-600"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 bg-zinc-800 text-white border border-zinc-700 rounded mb-2"
            placeholder="Write something..."
          />

          <button
            onClick={submitReview}
            className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-white font-medium"
          >
            Submit
          </button>
        </>
      )}

      <h3 className="text-md font-semibold mt-6 text-cyan-400">Reviews</h3>
      <div className="space-y-3 mt-2">
        {reviews.length === 0 && (
          <p className="text-sm text-zinc-400 italic">No reviews yet.</p>
        )}

        {yourReview && (
          <div className="bg-zinc-800 p-3 rounded border border-zinc-700">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-green-400">Your Review</p>
              <p className="text-yellow-400">
                {"★".repeat(yourReview.rating)}
                {"☆".repeat(5 - yourReview.rating)}
              </p>
            </div>
            <p className="text-sm mt-1 text-zinc-200">{yourReview.comment}</p>
          </div>
        )}

        {others.map((rev, index) => (
          <div
            key={index}
            className="bg-zinc-800 p-3 rounded border border-zinc-700"
          >
            <div className="flex justify-between">
              <p className="font-semibold text-pink-400">{rev.user}</p>
              <p className="text-yellow-400">
                {"★".repeat(rev.rating)}
                {"☆".repeat(5 - rev.rating)}
              </p>
            </div>
            <p className="text-sm mt-1 text-zinc-200">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
