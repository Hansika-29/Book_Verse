// src/components/ShelfTabs.jsx

import React from "react";

const ShelfTabs = ({ activeTab, setActiveTab }) => {
  const shelves = [
    { label: "Currently Reading", value: "reading" },
    { label: "Read", value: "read" },
    { label: "Wishlist", value: "wishlist" },
  ];

  return (
    <div className="flex space-x-4">
      {shelves.map(shelf => (
        <button
          key={shelf.value}
          onClick={() => setActiveTab(shelf.value)}
          className={`px-4 py-2 rounded ${
            activeTab === shelf.value
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {shelf.label}
        </button>
      ))}
    </div>
  );
};

export default ShelfTabs;
