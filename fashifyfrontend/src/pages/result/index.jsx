import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/config";
import { getLocal } from "../../helpers/auth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom"; // Added useNavigate

const Result = () => {
  const [outfitItems, setOutfitItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const stored = localStorage.getItem("recommendations");
    if (stored) {
      setOutfitItems(JSON.parse(stored));
    }
  }, []);

  const toggleSelection = (id) => {
    setSelectedIds(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  const handleSave = async () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one outfit to save.");
      return;
    }

    const tokenData = getLocal();
    let username = null;
    let access = null;
    
    if (tokenData) {
      const parsedToken = JSON.parse(tokenData);
      access = parsedToken.access;
      const decoded = jwtDecode(access);
      username = decoded?.user_id;
    }

    try {
      const selectedItemsArray = Array.from(selectedIds);
      const res = await axios.post(`${BASE_URL}api/save-recent/`, {
        user: username,
        items: selectedItemsArray,
      });
      
      console.log(res.data);
      alert(`${selectedItemsArray.length} outfit(s) saved successfully!`);
      navigate("/activity"); 
      setSelectedIds(new Set());
    } catch (err) {
      console.error(err);
      alert("Failed to save outfit(s).");
    }
  };

  return (
    <div className="px-10 w-full pt-26 mx-auto p-6 bg-[#FBF6EF] min-h-screen">

      {outfitItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-xl font-medium text-gray-700 mt-4">
              No Matching Recommendations Found
            </h2>
            <p className="text-gray-500 mt-2">
              We couldn't find any outfits in your collection that match your preferences.
            </p>
            <p className="text-gray-500 mt-1">
              Try adjusting your preferences or adding more items to your collection.
            </p>
            <button
              onClick={() => navigate("/getStart")}
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Try Different Preferences
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-medium mb-8">
            Your Perfect Outfit, Tailored Just for You!
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {outfitItems.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-lg overflow-hidden shadow cursor-pointer border-2 ${
                  selectedIds.has(item.id) ? "border-orange-500" : "border-transparent"
                }`}
                onClick={() => toggleSelection(item.id)}
              >
                <div className="h-36 md:h-40 overflow-hidden">
                  <img
                    src={`${BASE_URL}${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 bg-[#FFC8A9]">
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-700">{item.clothing_type}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={handleSave}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Save {selectedIds.size > 0 ? `(${selectedIds.size})` : ''} Outfit(s)
            </button>
            <button
              onClick={() => navigate("/getStart")}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md transition-colors"
            >
              Try Another
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Result;