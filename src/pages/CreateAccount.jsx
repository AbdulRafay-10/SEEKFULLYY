import React, { useState } from "react";
import Button from "../components/constant/Button";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
} from "../assets/icons/SocialIcons";
import googleLogo from "../assets/icons/icons8-google.svg";
import logo from "../assets/images/Logo.png";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const CreateAccount = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] px-4 py-10">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col items-center gap-6">
        
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-[150px] sm:w-[196px] h-auto" />

        {/* Heading */}
        <h2 className="text-3xl sm:text-[45px] font-bold text-center text-black">
          Create an Account
        </h2>

        {/* Google Button */}
        <button className="w-full h-[44px] flex items-center justify-center gap-2 border border-gray-300 text-sm font-medium hover:bg-gray-100 transition rounded-md">
          <img src={googleLogo} alt="Google" className="w-5 h-5" />
          Sign up with Google
        </button>

        {/* OR Divider */}
        <div className="flex items-center gap-4 w-full max-w-xs">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        {/* Form */}
        <form className="space-y-6 w-full">
          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-[#9794aa]">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full h-[50px] border placeholder-[#686677] placeholder:font-semibold border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-[var(--primary-color)] px-4"
            />
          </div>

          {/* Full Name */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-[#9794aa]">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full h-[50px] border placeholder-[#686677] placeholder:font-semibold border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-[var(--primary-color)] px-4"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label className="mb-1 text-sm font-medium text-[#9794aa]">Create Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className="w-full h-[50px] border placeholder-[#686677] placeholder:font-semibold border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-[var(--primary-color)] px-4 pr-10"
            />
            <span
              className="absolute right-3 bottom-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Create Account Button */}
          <div className="w-full">
            <Link to="/">
              <Button className="w-full h-[50px] rounded-full text-sm">
                Create Account
              </Button>
            </Link>
          </div>
        </form>

        {/* Login Link */}
        <div className="flex items-center gap-2 text-sm mt-2">
          <p className="text-[#49475a]">Already have an account?</p>
          <Link to="/login" className="text-[var(--primary-color)] font-medium">
            Login
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 pt-2 text-gray-500">
          <a href="#"><FacebookIcon width={24} height={24} /></a>
          <a href="#"><TwitterIcon /></a>
          <a href="#"><InstagramIcon /></a>
          <a href="#"><LinkedInIcon /></a>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;