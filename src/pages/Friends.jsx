import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Friends = () => {
  const { user } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [friends, setFriends] = useState({});

  useEffect(() => {
    const fetchUsersAndFriends = async () => {
      if (!user?.uid) return;

      // Get all users
      const userSnap = await getDocs(collection(db, "users"));
      const filtered = userSnap.docs
        .map((doc) => ({ uid: doc.id, ...doc.data() }))
        .filter((u) => u.uid !== user.uid); // exclude self

      setAllUsers(filtered);

      // Get friend list
      const friendsSnap = await getDocs(
        collection(db, `friends/${user.uid}/list`)
      );
      const myFriends = {};
      friendsSnap.docs.forEach((doc) => {
        myFriends[doc.id] = doc.data();
      });
      setFriends(myFriends);
    };

    fetchUsersAndFriends();
  }, [user]);

  const toggleFriend = async (friend) => {
    const ref = doc(db, `friends/${user.uid}/list`, friend.uid);
    if (friends[friend.uid]) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, {
        displayName: friend.displayName,
        avatar: friend.avatar || "",
        addedAt: new Date(),
      });
    }

    setFriends((prev) => ({
      ...prev,
      [friend.uid]: !friends[friend.uid] ? friend : undefined,
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-6">👥 Your Friends</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allUsers.map((u) => {
          const isFriend = !!friends[u.uid];
          const avatar = u.avatar
            ? u.avatar
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                u.displayName || "User"
              )}&background=8b5cf6&color=fff&bold=true`;

          return (
            <div
              key={u.uid}
              className="bg-zinc-900 p-4 rounded shadow flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={avatar}
                  alt={u.displayName}
                  className="w-10 h-10 rounded-full border-2 border-purple-500"
                />
                <div>
                  <Link
                    to={`/friend/${u.uid}`}
                    className="font-semibold text-purple-400 hover:underline block"
                  >
                    {u.displayName}
                  </Link>
                  <p className="text-xs text-zinc-400">{u.email}</p>
                </div>
              </div>
              <button
                onClick={() => toggleFriend(u)}
                className={`px-4 py-1 rounded font-medium transition ${
                  isFriend
                    ? "bg-red-500 hover:bg-red-400"
                    : "bg-green-500 hover:bg-green-400"
                }`}
              >
                {isFriend ? "Remove" : "Add"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Friends;
