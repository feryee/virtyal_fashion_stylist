import React from "react";
import Navigator from "../../components/navigator";

const Onboard = () => {
  return (
    <main className="w-full h-screen  p-6">
      <div className="w-full h-full grid grid-cols-2">
        <div className="w-full h-full max-w-2xl relative bg-gradient-to-t from-black to-[#D45A00]  rounded-3xl overflow-hidden">
          <div className="absolute bottom-10 max-w-lg z-10 left-0 right-0 mx-auto flex flex-col">
            <h2 className="text-3xl font-bold text-white">
              Welcome Back to Fashify!
            </h2>
            <p className="text-white mt-2 font-extralight ">
              Log in to continue discovering styles, curating outfits, and
              staying ahead in fashion.
            </p>
          </div>
          <img
            src="/images/Group 234.png"
            alt=""
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="flex items-center justify-center  relative   ">
          <div className="  mr-20 w-full flex flex-col gap-y-8 items-center">
            <h3 className="text-gray-800 text-4xl  mt-4">
              Let's Find Your Perfect Fit – Enter Your Height, Weight, and Body
              Type.
            </h3>
            <form className="flex flex-col w-full gap-y-6">
              <div className="flex relative flex-col gap-y-1">
                <input
                  type="text"
                  className="text-sm p-3 pr-7 appearance-none px-5 border rounded-lg border-gray-300"
                  placeholder="Input your Height"
                />
                <span
                  className="absolute top-0 bottom-0 h-fit right-5
                 text-gray-400 font-medium text-sm my-auto"
                >
                  CM
                </span>
              </div>
              <div className="flex relative flex-col gap-y-1">
                <input
                  type="text"
                  className="text-sm p-3 pr-7 appearance-none px-5 border rounded-lg border-gray-300"
                  placeholder="Input your Weight"
                />
                <span
                  className="absolute top-0 bottom-0 h-fit right-5
                 text-gray-400 font-medium text-sm my-auto"
                >
                  KG
                </span>
              </div>
              <div className="flex relative flex-col gap-y-1">
                <select
                  className="text-sm p-3 appearance-none px-5 border rounded-lg border-gray-300 text-gray-700 w-full"
                  placeholder="Select Body Type"
                >
                  <option value="" disabled selected>
                    Select Body Type
                  </option>
                  <option value="slim">Slim</option>
                  <option value="athletic">Athletic</option>
                  <option value="average">Average</option>
                  <option value="curvy">Curvy</option>
                  <option value="plus-size">Plus Size</option>
                  <option value="tall">Tall</option>
                  <option value="petite">Petite</option>
                  <option value="broad-shoulders">Broad Shoulders</option>
                  <option value="pear-shape">Pear Shape</option>
                  <option value="hourglass">Hourglass</option>
                </select>
              </div>

              <div className="flex mt-6 items-center justify-end">
                <button
                  type="submit"
                  className="text-white bg-[#FF6B00] py-3 px-20 w-full rounded-lg"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
          <div className="absolute  top-0 right-0">
            <img src="/images/logo.svg" alt="" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Onboard;
