import React,{useState} from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import Navigator from "../../../components/navigator";
import { BASE_URL } from "../../../utils/config";
import { toast,Toaster } from 'react-hot-toast'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password1, setPassword1] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [isLoading, setIsLoading] = useState(false) // Added loading state
  const navigate = useNavigate() // Added for navigation

  const signupSubmit = async (e) => {
    e.preventDefault();
    if(!email || !password || !password1 || !weight || !height) {
      toast.error("Please fill all data")
      return
    }

    if (password !== password1) {
      toast.error("Password didn't match")
      return
    }

    setIsLoading(true) // Start loading
    
    try {
      const response = await fetch(`${BASE_URL}api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          username: email.split('@')[0],
          password,
          weight,
          height,
        })
      })
      
      if (response.status === 201) {
        toast.success("Account Created, Please Login..!")
        setEmail('');
        setPassword('');
        setPassword1('');
        setWeight('');
        setHeight('');
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/auth/login')
        }, 2000)
      } else if (response.status === 400) {
        const data = await response.json()
        toast.error(data.message || "Please fill all data correctly")
      } else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      toast.error("Network error occurred")
    } finally {
      setIsLoading(false) // Stop loading in any case
    }
  }

  return (
    <main className="w-full h-screen  p-6">
      <Toaster position='top-center' reverseOrder='false' ></Toaster>
      <div className="w-full h-full grid grid-cols-2">
        <div className="w-full h-full max-w-2xl relative bg-gradient-to-t from-black to-[#D45A00]  rounded-3xl overflow-hidden">
          <div className="absolute bottom-10 max-w-lg z-10 left-0 right-0 mx-auto flex flex-col">
            <h2 className="text-3xl font-bold text-white">
              Join Fashify – Your Style, Your Way!
            </h2>
            <p className="text-white mt-2 font-extralight ">
              Create an account to explore the latest trends, get personalized
              styling tips, and elevate your fashion game
            </p>
          </div>
          <img
            src="/images/register.png"
            alt=""
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        <div className="flex items-center justify-center  relative   ">
          <div className=" max-w-lg w-full flex flex-col gap-y-8 items-center">
            <Navigator />
            <p className="text-[#5B5B5B]  mt-4">
              Sign in to explore the latest fashion trends and personalized
              styling tips.
            </p>
            <form  className="flex flex-col w-full gap-y-6" onSubmit={signupSubmit}>
              <div className="flex flex-col gap-y-2">
                <label htmlFor="" className="text-sm">
                  Email ID
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm p-3 px-5 border rounded-full border-[#FF6B00]"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <label htmlFor="" className="text-sm">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-sm p-3 px-5 border rounded-full border-[#FF6B00]"
                  placeholder="Enter your Password"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <label htmlFor="" className="text-sm">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="password1"
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                  className="text-sm p-3 px-5 border rounded-full border-[#FF6B00]"
                  placeholder="Confirm your Password"
                />
              </div>

              <div className="flex flex-col gap-y-2">
                <label htmlFor="" className="text-sm">
                  Your Weight (in k.g)
                </label>
                <input
                  type="text"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="text-sm p-3 px-5 border rounded-full border-[#FF6B00]"
                  placeholder="Enter your weight"
                />
              </div>

              <div className="flex flex-col gap-y-2">
                <label htmlFor="" className="text-sm">
                  Your Height (in c.m)
                </label>
                <input
                  type="text"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="text-sm p-3 px-5 border rounded-full border-[#FF6B00]"
                  placeholder="Enter your height"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2 justify-start">
                  <input type="checkbox" name="" id="" />
                  <span className="text-xs font-light text-gray-600">
                    Remember me
                  </span>
                </div>
                <span className="text-xs font-light text-gray-600">
                  Forget Password?
                </span>
              </div>
              <div className="flex mt-6 items-center justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`text-white bg-[#FF6B00] py-3 px-20 w-fit rounded-full flex items-center justify-center ${isLoading ? 'opacity-70' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : 'Register'}
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

export default Register;