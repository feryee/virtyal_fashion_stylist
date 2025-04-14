import React from "react";
import Collections from "../../components/collections";
import Categories from "../../components/category";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="w-full  h-screen bg-gradient-to-br from-yellow-100 via-orange-300 to-red-300">
        <div className="h-full w-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-wide">
            FIND YOUR PERFECT
            <br />
            LOOK ON SUITABLE
          </h1>

          <p className="text-lg mb-10 text-gray-800">
            Tailored For Tessa With Fashify!
          </p>

          <Link
            to={"/getStart"}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full flex items-center gap-2 transition-transform hover:scale-105"
          >
            <span className="material-icons text-xl">explore</span>
            Explore Fashify Now
          </Link>
        </div>
      </div>
      {/* <main className="">
        <div className="px-10 ">
          <img src={"/images/banner.png"} alt="" className="w-full h-[400px]" />
          <Collections />
          <Categories />
        </div>
      </main> */}
    </>
  );
};

export default Home;
