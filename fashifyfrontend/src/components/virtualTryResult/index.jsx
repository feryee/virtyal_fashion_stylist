import React from "react";

const VirtualTryOnResult = ({ isOpen, onClose, onDownload, onContinue }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md md:max-w-lg overflow-hidden">
        {/* Virtual Try-On Result */}
        <div className="bg-white relative p-5 ">
          <div className="flex justify-center">
            <img src="/images/result.jpeg" alt="" />
          </div>
          <div className="flex bottom-4 left-5 right-5 bg-[#FFFFFFCC]/20 rounded-xl backdrop-blur-sm absolute z-50 items-center justify-between p-4">
            {/* Download Button */}
            <button
              onClick={onDownload}
              className="flex items-center justify-center bg-white hover:bg-gray-100 text-orange-500 p-2 rounded-full border border-orange-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>

            {/* Continue Button */}
            <button
              onClick={onContinue}
              className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-md transition-colors"
            >
              Continue
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-1"
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
        </div>

        {/* Action Buttons */}
      </div>
    </div>
  );
};

export default VirtualTryOnResult;
