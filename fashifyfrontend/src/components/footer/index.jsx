import React from "react";
import { FaTwitter, FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();
  if (pathname === "/getStart") {
    return null;
  }
  return (
    <footer className="bg-[#333333] text-white">
      {/* Contact Section */}
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <h2 className="text-5xl font-light mb-2">Stay Connected</h2>
        <h3 className="text-4xl font-light mb-8">We're Here to Help!</h3>
        <p className="text-[#FAFAFA99]/60 font-mono mb-2 max-w-xl font-extralight">
          Have any questions, feedback, or need support? Our team is always
          ready to assist you.
        </p>
        <p className="text-[#FAFAFA99]/60 mb-8 max-w-xl">
          Reach out to us for inquiries, collaborations, or any assistance you
          need!
        </p>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-full flex items-center">
          Contact Us
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Navigation and Social Media */}
      <div className="border-t border-gray-700 py-6 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Copyright */}
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/images/logo.svg" alt="" />
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-8 mb-4 md:mb-0">
            
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">

          </div>
        </div>
      </div>

      {/* Copyright and Terms */}
      <div className="border-t border-gray-700 py-4 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div>©copyright 2023, All Rights Reserved</div>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
