import React, { useEffect, useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.uid) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setDisplayName(data.displayName || "");
        setBio(data.bio || "");
        setAvatar(data.avatar || "");
      } else {
        // fallback to auth data
        setDisplayName(user.displayName || user.email || "");
      }
    };

    fetchProfile();
  }, [user]);

  const saveProfile = async () => {
    if (!user?.uid) return;
    const ref = doc(db, "users", user.uid);
    await setDoc(ref, {
      displayName,
      bio,
      avatar,
    });
    alert("✅ Profile updated!");
  };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    displayName || "User"
  )}&background=8b5cf6&color=fff&bold=true`;

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto bg-zinc-900 p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-purple-400 mb-4">👤 Your Profile</h1>

        <img
          src={avatar || defaultAvatar}
          alt="avatar"
          className="w-24 h-24 rounded-full mb-4 border-4 border-purple-500 shadow-lg"
        />

        <div className="mb-4">
          <label className="block text-zinc-400 mb-1">Display Name</label>
          <input
            className="w-full p-2 bg-zinc-800 text-white border border-zinc-700 rounded"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-zinc-400 mb-1">Bio</label>
          <textarea
            className="w-full p-2 bg-zinc-800 text-white border border-zinc-700 rounded"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-zinc-400 mb-1">Avatar Image URL</label>
          <input
            className="w-full p-2 bg-zinc-800 text-white border border-zinc-700 rounded"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        </div>

        <button
          onClick={saveProfile}
          className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded text-white font-medium"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
