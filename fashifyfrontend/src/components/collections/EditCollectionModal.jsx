import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../utils/config";
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";

const EditCollectionModal = ({ isOpen, onClose, item, onUpdateSuccess }) => {

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: item?.name || "",
        type: item?.type || "",
        fit_category: item?.fit_category || "",
        clothing_type: item?.clothing_type || "",
        occasion: item?.occasion || "",
        season: item?.season || "",
        style: item?.style || "",
        fabric: item?.fabric || "",
        color_palette: item?.color_palette || "",
    });

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(item?.image || null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (item) {
        setFormData({
            name: item.name || "",
            type: item.type || "",
            fit_category: item.fit_category || "",
            clothing_type: item.clothing_type || "",
            occasion: item.occasion || "",
            season: item.season || "",
            style: item.style || "",
            fabric: item.fabric || "",
            color_palette: item.color_palette || "",
        });
        setPreviewUrl(item.image || null);
        }
    }, [item]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };


    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        
        // Append file if it exists
        if (file) {
        data.append("image", file);
        }
        
        // Append all form data
        Object.keys(formData).forEach(key => {
        if (formData[key]) {
            data.append(key, formData[key]);
        }
        });

        try {
            for (let pair of data.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }
            const res = await axios({
                method: 'put',
                url: `${BASE_URL}api/edit-to-collection/${item.id}/`,
                data: data
            })

            if (res.status === 200) {
                setIsLoading(false)
                toast.success("Item updated succesfully");
                
                setTimeout(() => {
                onClose(); // close the modal
                navigate("/collections"); // redirect
                }, 1000);
            } else {
                console.log(res)
                toast.error("Errorr")
            }

        } catch (error) {
        console.error("Error updating item:", error);
        toast.error("Failed to update item");
        } finally {
        setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 py-10 bg-opacity-50 flex items-center justify-center z-50">
        <div
        className="bg-white w-full h-full overflow-y-auto max-w-xl rounded-lg p-6"
        >
        <h2 className="text-xl font-medium mb-2">Edit</h2>

            <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Image</label>
            <input 
                type="file" 
                onChange={handleFileChange} 
                className="mb-2"
            />
            {previewUrl && (
                <img 
                src={previewUrl} 
                alt="Preview" 
                className="h-32 object-contain mb-2"
                />
            )}
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


            <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
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

export default EditCollectionModal;