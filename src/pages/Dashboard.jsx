import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import BookCard from "../components/BookCard";
import ShelfTabs from "../components/ShelfTabs";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [shelf, setShelf] = useState("reading");
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({
    reading: 0,
    read: 0,
    wishlist: 0,
    reviews: 0,
    avgRating: 0,
  });

  useEffect(() => {
    // ✅ Guard first — prevent Firestore crash
    if (!user?.uid || loading) return;

    const fetchData = async () => {
      try {
        const shelfTypes = ["reading", "read", "wishlist"];
        const shelfStats = {};

        for (let type of shelfTypes) {
          const q = query(
            collection(db, "books"),
            where("uid", "==", user.uid),
            where("shelf", "==", type)
          );
          const snap = await getDocs(q);
          shelfStats[type] = snap.size;

          if (type === shelf) {
            setBooks(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

          }
        }

        const reviewQ = query(
          collection(db, "reviews"),
          where("uid", "==", user.uid)
        );
        const reviewSnap = await getDocs(reviewQ);
        const reviews = reviewSnap.docs.map((doc) => doc.data());
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const avg = reviews.length ? (totalRating / reviews.length).toFixed(1) : 0;

        setStats({
          ...shelfStats,
          reviews: reviews.length,
          avgRating: avg,
        });
      } catch (error) {
        console.error("❌ Firestore fetch error:", error);
      }
    };

    fetchData();
  }, [shelf, user?.uid, loading]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <p className="text-purple-300 text-lg animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">📚 Your Dashboard</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-900 p-4 rounded text-center">
          <p className="text-lg font-semibold text-yellow-400">Reading</p>
          <p className="text-2xl font-bold">{stats.reading}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded text-center">
          <p className="text-lg font-semibold text-green-400">Read</p>
          <p className="text-2xl font-bold">{stats.read}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded text-center">
          <p className="text-lg font-semibold text-pink-400">Wishlist</p>
          <p className="text-2xl font-bold">{stats.wishlist}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded text-center">
          <p className="text-lg font-semibold text-blue-400">Reviews</p>
          <p className="text-2xl font-bold">{stats.reviews}</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded text-center">
          <p className="text-lg font-semibold text-orange-400">Avg. Rating</p>
          <p className="text-2xl font-bold">{stats.avgRating}</p>
        </div>
      </div>

      <ShelfTabs activeTab={shelf} setActiveTab={setShelf} />
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {books.length > 0 ? (
          books.map((book, index) => <BookCard key={index} book={book} />)
        ) : (
          <p className="text-zinc-400">No books in this shelf yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
