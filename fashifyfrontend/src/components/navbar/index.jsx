// In your Navbar.jsx, update the code to handle the modal
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AddCollectionModal from "../collections/AddCollectionModal";
import { getLocal } from "../../helpers/auth";
import { jwtDecode } from "jwt-decode"; // ✅ correct way for Vite


const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showProfileBox, setShowProfileBox] = useState(false);
  const [userName, setUserName] = useState(null);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Toggle profile dropdown
  const toggleProfileBox = () => setShowProfileBox((prev) => !prev);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setShowProfileBox(false);
    navigate("/auth/login");
  };

  // Decode token
  useEffect(() => {
    const tokenData = getLocal();
    if (tokenData) {
      const { access } = JSON.parse(tokenData);
      const decoded = jwtDecode(access);
      setUserName(decoded?.username);
    }
  }, []);

  return (
    <>
      <nav className="flex absolute top-0 left-0 right-0 px-10 py-6 items-center justify-between">
        <Link to={"/"}>
          <img src="/images/logo.svg" alt="" className="" />
        </Link>
        <ul className="flex items-center justify-center gap-x-10 text-sm">
          <Link to={"/"} className="cursor-pointer hover:text-[#FF6B00]">
            Home
          </Link>
          <Link
            to={"/collections"}
            className="cursor-pointer hover:text-[#FF6B00]"
          >
            Collections{" "}
          </Link>
          <Link
            to={"/activity"}
            className="cursor-pointer hover:text-[#FF6B00]"
          >
            Recent Recomendations
          </Link>
        </ul>
        <div className="flex items-center justify-end gap-x-3">
          {pathname !== "/getStart" && (
            <button
              onClick={openModal}
              className="text-white bg-[#FF6B00] py-3 text-sm px-5 rounded-lg"
            >
              Add Collection
            </button>
          )}
          {/* User Icon & Dropdown */}
          {userName ? (
            <div className="relative">
              <button
                onClick={toggleProfileBox}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <img src="/icons/user.svg" alt="Profile" className="w-7 h-7" />
              </button>

              {showProfileBox && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md border w-48 py-3 px-4 z-50">
                  <p className="font-medium text-gray-800 mb-2">{userName}</p>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to={"/auth/login"}>
              <img src="/icons/user.svg" alt="Login" className="w-8 h-8" />
            </Link>
          )}
        </div>
      </nav>

      <AddCollectionModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default Navbar;
