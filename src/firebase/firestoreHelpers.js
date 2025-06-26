// src/firebase/firestoreHelpers.js
import { db } from "./config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const addBookToShelf = async (user, bookData, shelfType) => {
  try {
    await addDoc(collection(db, "books"), {
  uid: user.uid,
  googleId: bookData.googleId || "", // in case it's undefined
  title: bookData.title,
  author: bookData.author,
  thumbnail: bookData.thumbnail,
  shelf: shelfType,
  createdAt: serverTimestamp(),
});

  } catch (err) {
    console.error("Error adding book: ", err);
  }
};
