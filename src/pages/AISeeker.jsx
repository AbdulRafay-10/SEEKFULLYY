import React from "react";
import Logo from "../assets/icons/Group 48095547.png";
import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";


const AISeeker = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-7xl min-h-screen flex-1 p-12 shadow-xl rounded-3xl flex flex-col items-center justify-center bg-white">
        <div className="flex justify-center items-center mb-6">
          <img src={Logo} alt="" />
        </div>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#3d2d4c]">
            Get Help From SeekerAI
          </h1>
        </div>
        <div className="relative w-[400px] sm:w-[600px] md:w-[900px]">
          <input
            type="text"
            placeholder="Massege SeekerAI"
            className="w-full h-[60px] placeholder:text-[#3d2d4c] border rounded-lg pr-16 pl-4"
            style={{ borderColor: "var(--primary-color)" }}
          />
          <Link to="/ai-chat"><button className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-[var(--primary-color)] rounded-lg p-1.5 flex items-center justify-center">
            <ArrowUp size={24} className="text-white" />
          </button></Link>
        </div>
      </div>
    </div>
  );
};

export default AISeeker;