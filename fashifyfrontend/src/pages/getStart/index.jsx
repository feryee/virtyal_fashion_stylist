import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import { getLocal } from "../../helpers/auth";
import { jwtDecode } from "jwt-decode"; // ✅ correct way for Vite
import { BASE_URL } from "../../utils/config";
import axios from "axios";

const GetStart = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    occasionType: "",
    clothingPreferences: [],
    accessories: [],
    weatherType: "",
    fashionStyle: "",
  });

  const steps = [
    {
      id: 0,
      title:
        "Dress for every moment – Choose the occasion to find your perfect look!",
      field: "occasionType",
      selectLabel: "Select Occasion Type",
      buttonText: "Continue",
      component: "dropdown",
      options: ["Casual", "Formal", "Party", "Office Wear", "Travel", "Wedding", "Gym & Activewear", "Shoes", "Bags", "Watches", "Jewelry", "Sunglasses"],
    },
    {
      id: 1,
      title: "Your style, your choice – Tell us what you love to wear!",
      component: "checkboxes",
      buttonText: "Submit",
      sections: [
        {
          title: "Clothing Type",
          field: "clothingPreferences",
          options: [
            "Tops & Tees",
            "Shirts",
            "Dresses",
            "Pants & Jeans",
            "Shorts & Skirts",
            "Ethnic Wear",
          ],
        },
        {
          title: "Accessories & Add-ons",
          field: "accessories",
          options: ["Shoes", "Bags", "Watches", "Jewelry", "Sunglasses"],
        },
      ],
    },
    {
      id: 2,
      title:
        "Stay stylish in any season – Pick the weather for the best outfit match!",
      field: "weatherType",
      selectLabel: "Select Weather Type",
      buttonText: "Submit",
      component: "dropdown",
      options: ["Summer", "Winter", "Spring", "Monsoon"],
    },
    {
      id: 3,
      title:
        "Define your vibe – Select your fashion style for a personalized outfit!",
      field: "fashionStyle",
      component: "checkboxes",
      buttonText: "Submit",
      options: [
        "Classic",
        "Streetwear",
        "Minimalist",
        "Bohemian",
        "Sporty",
        "Luxury",
      ],
    },
  ];

  const handleDropdownChange = (e) => {
    setFormData({
      ...formData,
      [steps[currentStep].field]: e.target.value,
    });
  };

  const handleCheckboxChange = (section, option) => {
    const field = section?.field || steps[currentStep].field;
    let updatedValues = [...(formData[field] || [])];

    if (updatedValues.includes(option)) {
      updatedValues = updatedValues.filter((item) => item !== option);
    } else {
      updatedValues.push(option);
    }

    setFormData({
      ...formData,
      [field]: updatedValues,
    });
  };

  const  handleContinue = async () => {

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {

      const tokenData = getLocal();

      let username = null;
      let access = null;
      const parsedToken = JSON.parse(tokenData);
      access = parsedToken.access; // token string
      const decoded = jwtDecode(access);
      username = decoded?.user_id;

      const data = new FormData();

      data.append("user_id", username); // Add username to the form data
    
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Submit final data
      try {

        for (let pair of data.entries()) {
          console.log(`${pair[0]}:`, pair[1]);
        }

        setLoading(true);

        const response = await axios({
          method: 'post',
          url: `${BASE_URL}api/ml-recommendation/`,
          data: data
        })

        //setLoading(false);

        console.log("Response:", response);

        const recommendations = response.data.recommendations;

        // ✅ Save to localStorage for result page
        localStorage.setItem("recommendations", JSON.stringify(recommendations));

        

        // Here you would typically send the data to your backend
        // or proceed to the recommendations page
        setTimeout(() => {
          navigate("/result");
        }, 6000);
      } catch (error) {
        console.error("Error uploading:", error);
      }
    }
  };

  const isStepValid = () => {
    const step = steps[currentStep];

    if (step.component === "dropdown") {
      return formData[step.field];
    } else if (step.component === "checkboxes") {
      if (step.sections) {
        // For the step with multiple sections of checkboxes
        return (
          formData[step.sections[0].field]?.length > 0 ||
          formData[step.sections[1].field]?.length > 0
        );
      } else {
        // For single section of checkboxes
        return formData[step.field]?.length > 0;
      }
    }
    return false;
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  if (loading) {
    return (
      <div className="h-[88vh] relative w-full flex items-center justify-center">
        <Loading />
        <div className="absolute w-[200px] h-[70px] z-40 bg-[#FBF6EF] bottom-0 right-0"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 h-[70vh] w-full flex items-center justify-center">
      <div className="w-full">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Question Title */}
        <h2 className="text-xl md:text-2xl font-medium mb-8 text-center">
          {steps[currentStep].title}
        </h2>

        {/* Step Content */}
        {steps[currentStep].component === "dropdown" && (
          <div className="mb-6">
            <select
              className="w-full p-3 bg-white rounded-md border border-gray-200 appearance-none cursor-pointer"
              value={formData[steps[currentStep].field] || ""}
              onChange={handleDropdownChange}
            >
              <option value="" disabled>
                {steps[currentStep].selectLabel}
              </option>
              {steps[currentStep].options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {steps[currentStep].component === "checkboxes" &&
          steps[currentStep].sections && (
            <div className="mb-6">
              {steps[currentStep].sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-4">
                  <h3 className="text-lg font-medium mb-2">{section.title}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {section.options.map((option) => (
                      <div key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`${section.field}-${option}`}
                          checked={
                            formData[section.field]?.includes(option) || false
                          }
                          onChange={() => handleCheckboxChange(section, option)}
                          className="mr-2"
                        />
                        <label htmlFor={`${section.field}-${option}`}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        {steps[currentStep].component === "checkboxes" &&
          !steps[currentStep].sections && (
            <div className="mb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {steps[currentStep].options.map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${steps[currentStep].field}-${option}`}
                      checked={
                        formData[steps[currentStep].field]?.includes(option) ||
                        false
                      }
                      onChange={() => handleCheckboxChange(null, option)}
                      className="mr-2"
                    />
                    <label htmlFor={`${steps[currentStep].field}-${option}`}>
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Continue/Submit Button */}
        <button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-md transition-colors"
          onClick={handleContinue}
          disabled={!isStepValid()}
        >
          {steps[currentStep].buttonText}
        </button>

        {/* Support Chat Button - Show in all steps except the first */}
        {currentStep > 0 && (
          <div className="fixed bottom-4 right-4">
            <button className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xl font-semibold">S</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetStart;
