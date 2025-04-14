import React from "react";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = [
    {
      title: "Men",
      description: "Casual, Formal, Ethnic, Ports and Active",
      image: "categroy1.jpeg",
    },
    {
      title: "Woman",
      description: "Everyday, Elegant, Traditional, Seasonal",
      image: "categroy2.jpeg",
    },
    {
      title: "Accessories",
      description:
        "Essentials, Eyewear, Wristwear, Bags & Wallets, Fragrances & Grooming",
      image: "categroy3.jpeg",
    },
  ];

  return (
    <div className="flex flex-col mt-8">
      <h4 className="text-xl my-2 mb-4">Top Categories</h4>
      <div className="grid grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Link
            to={"/detail"}
            key={index}
            className="rounded-lg overflow-hidden  text-center"
          >
            <img
              src={`/images/${category.image}`}
              alt={category.title}
              className="w-full h-[580px] object-cover rounded-lg"
            />
            <div className="p-4 ">
              <h5 className="text-lg font-semibold">{category.title}</h5>
              <p className="text-sm text-gray-700">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Categories;
