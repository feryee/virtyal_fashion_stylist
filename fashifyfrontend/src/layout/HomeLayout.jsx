import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const HomeLayout = () => {
  return (
    <>
      <div className="flex relative flex-col">
        <Navbar />

        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default HomeLayout;
