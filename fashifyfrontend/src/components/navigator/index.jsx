import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigator = () => {
  const { pathname } = useLocation();
  console.log(pathname);
  return (
    <div className=" flex items-center bg-[#FFF0E5] p-2 rounded-full">
      <Link
        to={"/auth/login"}
        className={`${
          pathname === "/auth/login"
            ? `bg-[#FF6B00] text-white`
            : `text-[#FF6B00]`
        }   py-3 rounded-full px-14`}
      >
        Login
      </Link>
      <Link
        to={"/auth/register"}
        className={`${
          pathname === "/auth/register"
            ? `bg-[#FF6B00] text-white`
            : `text-[#FF6B00]`
        }  text-[#FF6B00] py-3 rounded-full px-14`}
      >
        Register
      </Link>
    </div>
  );
};

export default Navigator;
