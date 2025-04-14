import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/config";
import axios from "axios";
import { getLocal } from "../../helpers/auth";
import { jwtDecode } from "jwt-decode";
import { toast, Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import EditCollectionModal from "../../components/collections/EditCollectionModal";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCollections, setLoadingCollections] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  let username = null;
  let access = null;

  const tokenData = getLocal();

  useEffect(() => {
    if (tokenData) {
      const parsedToken = JSON.parse(tokenData);
      access = parsedToken.access;
      const decoded = jwtDecode(access);
      username = decoded?.user_id;
    }

    fetchItem();
    getData();
  }, [id]);

  async function fetchItem() {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}api/single_collections/${id}`);
      setItem(response.data);
    } catch (error) {
      toast.error("Failed to fetch item details");
      console.error("Error fetching item:", error);
    } finally {
      setLoading(false);
    }
  }

  async function getData() {
    if (!username) return;
    
    setLoadingCollections(true);
    try {
      const response = await axios.get(
        `${BASE_URL}api/othercollections/${username}/${id}`
      );
      setCollections(response.data);
    } catch (error) {
      toast.error("Failed to fetch related items");
      console.error("Error fetching collections:", error);
    } finally {
      setLoadingCollections(false);
    }
  }

  const handleItemClick = async (clickedId) => {
    // Don't refetch if clicking the same item
    if (clickedId === id) return;
    
    try {
      setLoading(true);
      setLoadingCollections(true);
      
      // Fetch the new item details
      const itemResponse = await axios.get(
        `${BASE_URL}api/single_collections/${clickedId}`
      );
      setItem(itemResponse.data);
      
      // Fetch the new related items
      if (username) {
        const collectionsResponse = await axios.get(
          `${BASE_URL}api/othercollections/${username}/${clickedId}`
        );
        setCollections(collectionsResponse.data);
      }
      
      // Update the URL
      navigate(`/detail/${clickedId}`);
    } catch (error) {
      toast.error("Failed to load item");
      console.error("Error loading item:", error);
    } finally {
      setLoading(false);
      setLoadingCollections(false);
    }
  };



  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${BASE_URL}api/collection/${id}/`);
        if (response.status === 200) {
          toast.success('Item deleted successfully');
          navigate('/collections'); // Redirect to collections page after deletion
        }
      } catch (error) {
        toast.error('Failed to delete item');
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleUpdateSuccess = (updatedItem) => {
    setItem(updatedItem);
    setIsEditModalOpen(false);
    toast.success("Item updated successfully");
  };


  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading product details...</div>;

  return (
    <div className="bg-stone-50 pt-26 px-10 p-4 min-h-screen">
      <Toaster position="top-center" />
      {isEditModalOpen && (
        <EditCollectionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          item={item}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
      <div className="mx-auto">
        {/* Main Product Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 p-4">
          {/* Product Image */}
          <div className="md:w-1/2 max-h-[400px]">
            {item?.image && (
              <img
                src={`${item.image}`}
                alt={item?.name || "Product image"}
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-1/2">
            <h1 className="text-3xl font-serif mb-4">{item?.name}</h1>

            <div className="mb-6">
              <h2 className="font-medium mb-2">Specifications :</h2>
              <ul className="space-y-1 text-sm">
                {item?.type && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Type : {item.type}</span>
                  </li>
                )}
                {item?.clothing_type && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Clothing Type : {item.clothing_type}</span>
                  </li>
                )}
                {item?.occasion && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Occasion : {item.occasion}</span>
                  </li>
                )}
                {item?.season && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Season : {item.season}</span>
                  </li>
                )}
                {item?.style && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Style : {item.style}</span>
                  </li>
                )}
                {item?.fabric && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Fabric and Material : {item.fabric}</span>
                  </li>
                )}
                {item?.color_palette && (
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Color Palette : {item.color_palette}</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="flex gap-3 mt-auto">
              <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-md transition-colors" onClick={handleDelete}>
                Remove
              </button>
              <button className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-6 rounded-md transition-colors" onClick={handleEditClick}
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Other Items Section */}
        <div className="mt-8">
          <h2 className="text-xl font-medium mb-4">Other Items</h2>
          {loadingCollections ? (
            <div className="flex justify-center">Loading related items...</div>
          ) : collections.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {collections.map((collectionItem) => (
                <div
                  key={collectionItem.id}
                  className="bg-stone-100 rounded overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleItemClick(collectionItem.id)}
                >
                  <div className="h-56 overflow-hidden">
                    <img
                      src={`${BASE_URL}${collectionItem.image}`}
                      alt={collectionItem.name}
                      className="w-full h-full object-top object-cover"
                    />
                  </div>
                  <div className="p-2 bg-orange-100">
                    <h3 className="font-medium text-sm">{collectionItem.name}</h3>
                    <p className="text-xs text-gray-600">{collectionItem.type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No related items found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;