import React from "react";
import { ArrowLeft } from "lucide-react";
import Seeking from "../assets/images/Seeking.png";
import emoji from "../assets/images/emoji.png";
import ActivityCalender from "../components/ActivityTracker/ActivityCalender";
import { Link } from "react-router-dom";

const ActivityTracker = () => {
  const streak = 15;
  const best = 222;
  const perfectWeeks = 9;

  return (
    <div className="shadow-xl rounded-3xl bg-white p-6  font-sans">
      {/* Header */}
      <Link to="/more"><div className="flex items-center gap-2 mb-12">
        <ArrowLeft className="w-5 h-5 cursor-pointer" />
        <h2 className="text-3xl text-gray-800">Activity Tracker</h2>
      </div></Link>

      {/* Layout */}
      <div className="grid md:grid-cols-2  items-start">
        {/* 📅 Reused Calendar Component */}
        <div className="relative">
      
          <ActivityCalender/>
          
          <p className="text-2xl text-[#1e293b] font-semibold mt-4 text-start ml-12">
            {perfectWeeks} Perfect weeks
            <br /></p>
          <p className="text-2xl text-[#1e293b] font-semibold mt-4 text-start ml-12">
            Keep Seeking…
          </p>
        </div>

        {/* Right-side Content */}
        <div className="text-center absolute ml-96 ">
          {/* Heading with Emoji + Image */}
          <div className="flex justify-center items-center gap-2 mb-2">
            
            <img src={Seeking}  className="w-[260px] object-contain" />
          </div>

          {/* Verse */}
          <p className="text-[30px] text-[#1e293b] font-semibold mt-4 italic mb-6 leading-relaxed">
            Seek the Kingdom of God above all else, and live <br /> righteously, and He will
            give you everything <br /> you need.
            <br />
            <span className="font-semibold">Matthew 6:33 (NLT)</span>
          </p>

          {/* Stats */}
          <div className="space-y-4 text-lg font-semibold text-gray-800">
            <div className="flex justify-center items-center text-center">
              <img src={emoji} alt="" className="w-[130px]" />
               <span className="text-7xl ">{streak}</span>
              <br />
              </div>
              <div className="text-4xl font-semibold -mt-4 mb-12">
                 Seek Streak
              </div>
           
            <div className="flex justify-center items-center">
              <img src={emoji} alt="" className="w-[80px]" /> <span className="text-4xl text-black">{best} Best</span>
              <br />
              
            </div>
            <p className="text-4xl font-normal pb-10">231 weeks in a row</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityTracker;
