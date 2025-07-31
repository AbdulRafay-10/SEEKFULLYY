import React, { useState } from "react";
import {
  Home,
  Plus,
  Heart,
  Search as SearchIcon,
  User as UserIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import followers from "../assets/images/followers.png";
import profileImg from "../assets/images/Profile3.png";

const Sidebar = ({ activeIcon, setActiveIcon }) => (
  <aside className="w-20 bg-white flex flex-col items-center justify-start pl-6 pt-[236px]">
    <div className="flex flex-col items-center gap-7">
      <Link to="/community">
        <button onClick={() => setActiveIcon("home")}>
          <Home
            className={`w-6 h-6 ${
              activeIcon === "home" ? "text-[var(--primary-color)]" : "text-gray-400"
            }`}
          />
        </button>
      </Link>
      <Link to="/follow">
        <button onClick={() => setActiveIcon("search")}>
          <SearchIcon
            className={`w-6 h-6 ${
              activeIcon === "search" ? "text-[var(--primary-color)]" : "text-gray-400"
            }`}
          />
        </button>
      </Link>
      <button
        onClick={() => setActiveIcon("plus")}
        className={`flex items-center justify-center px-2 py-1 rounded-md ${
          activeIcon === "plus" ? "ring-2 ring-[var(--primary-color)]" : ""
        }`}
        style={{ backgroundColor: "var(--primary-color-light)" }}
      >
        <Plus className="w-6 h-6 text-black" />
      </button>
      <Link to="/like"><button onClick={() => setActiveIcon("heart")}>
        <Heart
          className={`w-6 h-6 ${
            activeIcon === "heart" ? "text-[var(--primary-color)]" : "text-gray-400"
          }`}
        />
      </button></Link>
      <button onClick={() => setActiveIcon("user")}>
        <UserIcon
          className={`w-6 h-6 ${
            activeIcon === "user" ? "text-[var(--primary-color)]" : "text-gray-400"
          }`}
        />
      </button>
    </div>
  </aside>
);

const FollowCard = () => (
  <div className="flex justify-between items-start border-b border-b-[#d9d9d9] py-4">
    <div className="flex gap-3">
      <img src={profileImg} alt="Profile" className="w-10 h-10 rounded-full" />
      <div>
        <h3 className="font-semibold text-sm">Victoria</h3>
        <p className="text-xs text-gray-500 mb-1">UX Researcher</p>
        <div className="text-xs text-gray-700">
          <p>🔍 Share various product UX research</p>
          <p>📚 UX research-related book publishing</p>
          <p>📍 Full member of the UX research society</p>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <img src={followers} alt="" className="w-11 h-4" />
          <div className="text-xs text-gray-500 mt-1">1,234 Followers</div>
        </div>
      </div>
    </div>
    <button className="text-sm text-black px-8 py-2.5 rounded-md border border-[#d9d9d9] hover:bg-[var(--primary-color)] hover:text-white transition">
      Follow
    </button>
  </div>
);

const FollowSuggestions = () => {
  const suggestions = new Array(6).fill(null);

  return (
    <div className="flex flex-col px-8 py-6 mt-[-10px] w-full">
      {/* Search input with icon */}
      <div className="relative mb-6">
        <SearchIcon className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search"
          className="w-full h-[50px] pl-12 pr-4 rounded-lg border p-2.5 bg-[#f5f5f5] border-gray-300 text-sm outline-none"
        />
      </div>

      <h2 className="text-md text-[#999999] font-semibold mb-2">Follow suggestions</h2>
      <div className="space-y-4">
        {suggestions.map((_, index) => (
          <FollowCard key={index} />
        ))}
      </div>
    </div>
  );
};

const CommunityFollowUI = () => {
  const [activeIcon, setActiveIcon] = useState("search");

  return (
    <div className="flex shadow-xl rounded-3xl overflow-hidden bg-white font-sans">
      <Sidebar activeIcon={activeIcon} setActiveIcon={setActiveIcon} />
      <main className="flex-1 bg-white">
        <FollowSuggestions />
      </main>
    </div>
  );
};

export default CommunityFollowUI;
