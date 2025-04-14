import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigator from "../../../components/navigator";
import login from "../../../helpers/auth";
import { getLocal } from "../../../helpers/auth";
import { toast, Toaster } from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  // ✅ Redirect if already logged in
  useEffect(() => {
    const token = getLocal();
    if (token) {
      navigate("/"); // redirect to dashboard or home
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    
    try {
      const fakeEvent = {
        target: {
          username: { value: email },
          password: { value: password },
        },
      };

      const data = await login(fakeEvent);
      if (data) {
        navigate("/"); // or any dashboard route
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false); // Stop loading in any case
    }
  };

  return (
    <main className="w-full h-screen p-6">
      <Toaster position='top-center' reverseOrder='false' />
      <div className="w-full h-full grid grid-cols-2">
        <div className="w-full h-full max-w-2xl relative bg-gradient-to-t from-black to-[#D45A00] rounded-3xl overflow-hidden">
          <div className="absolute bottom-10 max-w-lg z-10 left-0 right-0 mx-auto flex flex-col">
            <h2 className="text-3xl font-bold text-white">
              Welcome Back to Fashify!
            </h2>
            <p className="text-white mt-2 font-extralight">
              Log in to continue discovering styles, curating outfits, and
              staying ahead in fashion.
            </p>
          </div>
          <img
            src="/images/login.png"
            alt=""
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="flex items-center justify-center relative">
          <div className="max-w-lg w-full flex flex-col gap-y-8 items-center">
            <Navigator />
            <p className="text-[#5B5B5B] mt-4">
              Sign in to explore the latest fashion trends and personalized
              styling tips.
            </p>
            <form
              onSubmit={handleLogin}
              className="flex flex-col w-full gap-y-6"
            >
              <div className="flex flex-col gap-y-1">
                <label htmlFor="email" className="text-sm">Email ID</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm p-3 px-5 border rounded-full border-[#FF6B00]"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="flex flex-col gap-y-1">
                <label htmlFor="password" className="text-sm">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-sm p-3 px-5 border rounded-full border-[#FF6B00]"
                  placeholder="Enter your Password"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2 justify-start">
                  <input type="checkbox" name="" id="" />
                  <span className="text-xs font-thin text-gray-600">
                    Remember me
                  </span>
                </div>
                <span className="text-xs font-thin text-gray-600">
                  Forget Password?
                </span>
              </div>
              <div className="flex mt-6 items-center justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`text-white bg-[#FF6B00] py-3 px-20 w-fit rounded-full flex items-center justify-center ${
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
                      Logging in...
                    </>
                  ) : 'Login'}
                </button>
              </div>
            </form>
          </div>
          <div className="absolute top-0 right-0">
            <img src="/images/logo.svg" alt="" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;