import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../utils/config";
import axios from "axios";
import { getLocal } from "../../helpers/auth";
import { jwtDecode } from "jwt-decode"; // ✅ correct way for Vite

const Collections = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [collections, setCollections] = useState([]);

  let username = null;
  let access = null;

  const tokenData = getLocal();


  // ✅ Redirect if already logged in
  useEffect(() => {
    if (tokenData) {
      const parsedToken = JSON.parse(tokenData);
      access = parsedToken.access; // token string
      const decoded = jwtDecode(access);
      username = decoded?.user_id;
    }

    getData();
  }, []);

  async function getData() {
    console.log("hereeee insdeeee apiii")
    const response = await axios.get(`${BASE_URL}api/collections/${username}`)


    console.log("hereeeee",response.data)

    setCollections(response.data)
  }

  const colors = [
    "#FBCEB1",
    "#FFE5B4",
    "#F08080",
    "#FAD6A5",
    "#FFA07A",
    "#FDBCB4",
  ];
  let lastColorIndex = -1;

  const filterOptions = [
    "Top Preference",
    "Best Combinations",
    "Occasion",
    "Season",
    "Clothing Type",
    "Style Preference",
    "Fabric & Material",
    "Color Palette",
    "Accessories & Add-ons",
  ];

  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

  const applyFilters = () => {
    setIsFilterModalOpen(false);
    // Logic to apply filters would go here
  };

  return (
    <div className="flex flex-col mt-4 min-h-screen pt-20 px-10">
      <div className="flex justify-between items-center my-4">
        <h4 className="text-xl">My Collections</h4>
        {/* <div className="flex gap-4">
          {selectedFilters.map((filter, index) => (
            <div
              key={index}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {filter}
              <button
                onClick={() => toggleFilter(filter)}
                className="ml-1 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-1 rounded-lg text-sm"
          >
            Filter By
          </button>
          {selectedFilters.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-[#FF6B00] text-sm"
            >
              Reset
            </button>
          )}
        </div> */}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {collections.map((item, index) => {
          let colorIndex;
          do {
            colorIndex = Math.floor(Math.random() * colors.length);
          } while (colorIndex === lastColorIndex);
          lastColorIndex = colorIndex;

          return (
            <Link
              to={`/detail/${item.id}`}
              key={index}
              style={{ backgroundColor: colors[colorIndex] }}
              className="rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={`${BASE_URL+item.image}`}
                alt={item.title}
                className="w-full h-[260px] object-top object-cover"
              />
              <div className="p-3">
                <h5 className="font-medium">{item.name}</h5>
                <p className="text-sm text-gray-700 font-light">
                  {item.clothing_type}
                </p>
                <p className="font-medium text-sm">{item.occasion}, {item.season}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">All Filters</h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="text-gray-500"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {filterOptions.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`filter-${index}`}
                    checked={selectedFilters.includes(option)}
                    onChange={() => toggleFilter(option)}
                    className="w-4 h-4 border-gray-300 rounded"
                  />
                  <label htmlFor={`filter-${index}`} className="ml-2 text-sm">
                    {option}
                  </label>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={clearAllFilters}
                className="py-2 bg-gray-200 rounded-md text-sm"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="py-2 bg-[#FF6B00] text-white rounded-md text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;
