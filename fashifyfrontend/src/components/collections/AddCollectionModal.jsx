import React, { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../../utils/config";
import axios from "axios";
import { getLocal } from "../../helpers/auth";
import { jwtDecode } from "jwt-decode"; // ✅ correct way for Vite
import { toast,Toaster } from 'react-hot-toast'
import { Link, useNavigate } from "react-router-dom";

const AddCollectionModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Added loading state
  

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    fit_category: "",
    clothing_type: "",
    occasion: "",
    season: "",
    style: "",
    fabric: "",
    color_palette: "",
  });

  // Handle preview when file is selected
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Clean up
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleBrowseFiles = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    // Reset file input
    document.getElementById("fileInput").value = "";
  };

  const handleInputChange = (e) => {
    if (e.target.name === "type") {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        fit_category: "" // Clear fit category when type changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };


  const handleSubmit = async () => {
    if (!file || !formData.name || !formData.type) {
      toast.error("Please fill all required fields and upload an image.")
      return;
    }

    let username = null;
    let access = null;

    const tokenData = getLocal();
    if (tokenData) {
      const parsedToken = JSON.parse(tokenData);
      access = parsedToken.access; // token string
      const decoded = jwtDecode(access);
      username = decoded?.user_id;
    }

    console.log("Decoded username:", username);

  
    const data = new FormData();
    data.append("image", file); // 'image' must match your Django model field name
    data.append("user", username); // Add username to the form data
  
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
  

    try {
      setIsLoading(true)

      for (let pair of data.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const res = await axios({
        method: 'post',
        url: `${BASE_URL}api/add-to-collection/`,
        data: data
      })

  
      if (res.status === 201) {
        setIsLoading(false)
        toast.success("Item Added Successfully");
        
        resetForm();
        // Wait 1.5 seconds before closing and navigating
        setTimeout(() => {
          onClose(); // close the modal
          navigate("/collections"); // redirect
        }, 1000);
      }
      
    } catch (error) {
      setIsLoading(false)
      console.error("Error uploading:", error);
      toast.error("Upload failed. Please try again.")
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      fit_category: "",
      clothing_type: "",
      occasion: "",
      season: "",
      style: "",
      fabric: "",
      color_palette: "",
    });
    setFile(null);
    setPreviewUrl(null); // Also reset previewUrl
    // Reset file input
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";
  };


  const getFitCategoryOptions = () => {
    if (formData.type === "Clothing") {
      return (
        <>
          <option value="Slim Fit">Slim Fit</option>
          <option value="Regular">Regular</option>
          <option value="Athletic">Athletic</option>
          <option value="Plus Size">Plus Size</option>
        </>
      );
    } else if (formData.type === "Accessories") {
      return (
        <>
          <option value="Shoes">
            Shoes
          </option>
          <option value="Bags">
            Bags
          </option>
          <option value="Watches">
            Watches
          </option>
          <option value="Jewelry">
            Jewelry
          </option>
          <option value="Sunglasses">
            Sunglasses
          </option>
        </>
      );
    } else {
      return null;
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 py-10 bg-opacity-50 flex items-center justify-center z-50">
      <Toaster position='top-center' reverseOrder='false' ></Toaster>
      <div
        ref={modalRef}
        className="bg-white w-full h-full overflow-y-auto max-w-xl rounded-lg p-6"
      >
        <h2 className="text-xl font-medium mb-2">Add item to collection</h2>

        <div className="mb-6">
          <p className="text-sm font-medium mb-1">Media Upload</p>
          <p className="text-xs text-gray-500 mb-2">
            Add your documents here, and you can upload up to 5 files max
          </p>

            {previewUrl ? (
              <div className="border border-dashed border-orange-400 rounded-md p-4">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-contain rounded-md"
                  />
                  <button
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  >
                    {/* Your close icon */}
                  </button>
                </div>
                {file && <p className="text-xs text-gray-500 mt-2">{file.name}</p>}
              </div>
            ) : (
            <div
              className="border border-dashed border-orange-400 rounded-md p-8 flex flex-col items-center justify-center"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 17.5V12.5M12 12.5V7.5M12 12.5H17M12 12.5H7"
                  stroke="#FF6B00"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#FF6B00"
                  strokeWidth="2"
                />
              </svg>

              <p className="text-sm mt-2 mb-1">
                Drag your file(s) or{" "}
                <span
                  className="text-orange-500 cursor-pointer"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  browse
                </span>
              </p>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleBrowseFiles}
                accept=".jpg,.jpeg,.png,.svg,.gif"
              />
              <p className="text-xs text-gray-500">
                Max 10 MB files are allowed
              </p>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            Only support .jpg, .png and .svg and .gif files
          </p>
        </div>

        {/* Rest of the form remains the same */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Item Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md p-2 text-sm"
            placeholder="Enter your project name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Type</label>
          <div className="relative">
            <select className="w-full border border-gray-300 rounded-md p-2 appearance-none text-sm" 
              name="type"
              value={formData.type}
              onChange={handleInputChange}
            >
              <option value="" disabled selected>
                Select Type
              </option>
              <option value="Clothing">
                Clothing
              </option>
              <option value="Accessories">
                Accessories
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>



        <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          {formData.type === "Accessories" ? "Size/Fit" : "Fit Category"}
        </label>
        <div className="relative">
          <select
            className="w-full border border-gray-300 rounded-md p-2 appearance-none text-sm"
            name="fit_category"
            value={formData.fit_category}
            onChange={handleInputChange}
            disabled={!formData.type} // Disable if no type is selected
          >
            <option value="" disabled selected>
              {formData.type === "Accessories" 
                ? "Select Size/Fit" 
                : "Select Fit Category"}
            </option>
            {getFitCategoryOptions()}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>



        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Clothing Type
          </label>
          <div className="relative">
            <select className="w-full border border-gray-300 rounded-md p-2 appearance-none text-sm"
              name="clothing_type"
              value={formData.clothing_type}
              onChange={handleInputChange}
            >
              <option value="" disabled selected>
                Select Clothing Type
              </option>

              <option value="Tops & Tees">
                Tops & Tees
              </option>
              <option value="Shirts">
                Shirts
              </option>
              <option value="Dresses">
                Dresses
              </option>
              <option value="Pants & Jeans">
                Pants & Jeans
              </option>
              <option value="Shorts & Skirts">
                Shorts & Skirts
              </option>
              <option value="Ethnic Wear">
                Ethnic Wear
              </option>

            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Occasion</label>
          <div className="relative">
            <select className="w-full border border-gray-300 rounded-md p-2 appearance-none text-sm"
              name="occasion"
              value={formData.occasion}
              onChange={handleInputChange}
            >
              <option value="" disabled selected>
                Select Suitable Occasions
              </option>

              <option value="Casual">
                Casual
              </option>
              <option value="Formal">
                Formal
              </option>
              <option value="Party">
                Party
              </option>
              <option value="Office Wear">
                Office Wear
              </option>
              <option value="Travel">
                Travel
              </option>
              <option value="Wedding">
                Wedding
              </option>
              <option value="Gym & Activewear">
                Gym & Activewear
              </option>
              
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Season</label>
          <div className="relative">
            <select className="w-full border border-gray-300 rounded-md p-2 appearance-none text-sm"
              name="season"
              value={formData.season}
              onChange={handleInputChange}
            >
              <option value="" disabled selected>
                Select Suitable Season
              </option>

              <option value="Summer"  >
                Summer
              </option>
              <option value="Winter"  >
                Winter
              </option>
              <option value="Spring"  >
                Spring
              </option>
              <option value="Monsoon" >
                Monsoon
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Style</label>
          <div className="relative">
            <select className="w-full border border-gray-300 rounded-md p-2 appearance-none text-sm"
              name="style"
              value={formData.style}
              onChange={handleInputChange}
            >
              <option value="" disabled selected>
                Select Suitable Style preference
              </option>

              <option value="Classic">
                Classic
              </option>
              <option value="Streetwear">
                Streetwear
              </option>
              <option value="Minimalist">
                Minimalist
              </option>
              <option value="Bohemian">
                Bohemian
              </option>
              <option value="Sporty">
                Sporty
              </option>
              <option value="Luxury">
                Luxury
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Fabric and Material
          </label>
          <div className="relative">
            <select className="w-full border border-gray-300 rounded-md p-2 appearance-none text-sm"
              name="fabric"
              value={formData.fabric}
              onChange={handleInputChange}
            >
              <option value="" disabled selected>
                Select Suitable Fabric and Material
              </option>
              <option value="Linen">
                Linen
              </option>
              <option value="Cotton">
                Cotton
              </option>
              <option value="Silk">
                Silk
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Color Palette
          </label>
          <div className="relative">
            <select className="w-full border border-gray-300 rounded-md p-2 appearance-none text-sm"
              name="color_palette"
              value={formData.color_palette}
              onChange={handleInputChange}
            >
              <option value="" disabled selected>
                Select Suitable Color Palette
              </option>

              <option value="Monochromatic">
                Monochromatic
              </option>
              <option value="Warm Tones">
                Warm Tones
              </option>
              <option value="Pastels">
                Pastels
              </option>
              <option value="Neutrals">
                Neutrals
              </option>
              <option value="Bold & Vibrant	">
                Bold & Vibrant
              </option>

            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1.5L6 6.5L11 1.5"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            className="py-3 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>

          
          {/* <button className="py-3 px-4 bg-[#FF6B00] text-white rounded-md hover:bg-orange-600" onClick={handleSubmit}>
            Add to Collection
          </button> */}


          <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className={`py-3 px-4 bg-[#FF6B00] text-white rounded-md hover:bg-orange-600 ${
                    isLoading ? 'opacity-70' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg 
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        ></circle>
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : 'Add to Collection'}
                </button>
        </div>
      </div>
    </div>
  );
};

export default AddCollectionModal;
