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
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-black">
          Login
        </h2>

        {/* Google Button */}
        <button className="flex items-center justify-center gap-3 border border-gray-300 text-sm font-medium hover:bg-gray-100 transition rounded-md w-full h-11 px-4">
          <img src={googleLogo} alt="Google" className="w-5 h-5" />
          Sign up with Google
        </button>

        {/* OR Divider */}
        <div className="flex items-center gap-4 w-full max-w-sm">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Form */}
        <form className="space-y-6 w-full">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-[#9794aa]">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full border placeholder-[#686677] placeholder:font-semibold border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-[var(--primary-color)] px-4 h-[50px]"
            />
          </div>

          <div className="flex flex-col relative">
            <label className="mb-1 text-sm font-medium text-[#9794aa]">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full border placeholder-[#686677] placeholder:font-semibold border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-[var(--primary-color)] px-4 pr-10 h-[50px]"
            />
            <span
              className="absolute right-3 bottom-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <div className="w-full">
  <Link to="/">
    <Button className="w-full h-[50px] rounded-full text-sm">
      Login
    </Button>
  </Link>
</div>
        </form>

        {/* Register Link */}
        <div className="flex items-center gap-2 text-sm">
          <p className="text-[#49475a]">Don't have an account?</p>
          <Link to="/create-account" className="font-medium text-[var(--primary-color)]">
            Register
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
