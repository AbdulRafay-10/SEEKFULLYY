import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import VerseMapping from "../assets/images/VerseMapping.png";
import VerseMapping2 from "../assets/images/VerseMapping2.png";
import Recent from "../assets/images/Recents.png";
import { Link } from "react-router-dom";
import tinycolor from "tinycolor2";

// Preset theme colors
const colors = ["#C0392B", "#D8A39D", "#A89F91", "#3C3E50", "#D4A017"]

const Home = () => {
  const [activeTab, setActiveTab] = useState("Mapping");
  const [showColors, setShowColors] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#D0021B");

  const handleColorChange = (color) => {
    setSelectedColor(color);
    const lightColor = tinycolor(color).lighten(35).toHexString();
    document.documentElement.style.setProperty("--primary-color", color);
    document.documentElement.style.setProperty("--primary-color-light", lightColor);
    setShowColors(false);
  };

  const templates = [
    { src: VerseMapping2, alt: "Template 1", bgColor: "#c10201" },
    { src: VerseMapping, alt: "Template 2", bgColor: "#2d4253" },
    { src: VerseMapping2, alt: "Template 3", bgColor: "#d79f28" },
    { src: VerseMapping, alt: "Template 4", bgColor: "#cd998e" },
    { src: VerseMapping2, alt: "Template 5", bgColor: "#8e8c7d" },
  ];

  return (
    <div className="p-6 shadow-xl  rounded-3xl">
      {/* Login / Register */}
      <div className="flex justify-end mb-4">
        <div className="flex gap-3">
         <Link to="/login"> <button className="px-10 py-2 rounded-full text-white bg-[var(--primary-color)] text-sm font-semibold">
            Login
          </button></Link>
         <Link to="/create-account"> <button className="px-10 py-2 rounded-full text-[var(--primary-color)] border border-[var(--primary-color)] text-sm font-semibold">
            Register
          </button></Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <div className="flex gap-8 text-lg font-medium">
          <button
            onClick={() => setActiveTab("Mapping")}
            className={`pb-1 border-b-2 ${
              activeTab === "Mapping"
                ? "text-[var(--primary-color)] border-[var(--primary-color)]"
                : "text-gray-400 border-transparent"
            }`}
          >
            Mapping
          </button>
         <Link to="/community"> <button
            onClick={() => setActiveTab("Community")}
            className={`pb-1 border-b-2 ${
              activeTab === "Community"
                ? "text-[var(--primary-color)] border-[var(--primary-color)]"
                : "text-gray-400 border-transparent"
            }`}
          >
            Community
          </button></Link>
        </div>
      </div>

      {/* Search + Theme Color */}
      <div className="flex justify-center items-center gap-2 mb-10">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </span>
          <input
            placeholder="Search"
            className="w-[628px] h-[48px] rounded-lg border border-[var(--primary-color)] px-4 pl-10 text-sm"
          />
        </div>

        <div className="relative w-[74px] h-[48px] flex items-center justify-between p-2 border border-[var(--primary-color)] cursor-pointer rounded-lg">
          <div
            className="w-6 h-6  rounded-full border border-[var(--primary-color)] cursor-pointer"
            style={{ backgroundColor:"var(--primary-color)" }}
          ></div>
          <button
            onClick={() => setShowColors(!showColors)}
            className="absolute left-10 top-1/2 -translate-y-1/2"
          >
            <ChevronDown size={18} />
          </button>

          {/* Color Picker Popover */}
          {showColors && (
            <div className="absolute right-0 top-14 bg-white border shadow-lg p-4 rounded-md z-50 w-64">
              {/* Color Picker */}
              <HexColorPicker
                color={selectedColor}
                onChange={(color) => {
                  setSelectedColor(color);
                  document.documentElement.style.setProperty(
                    "--primary-color",
                    color
                  );
                  document.documentElement.style.setProperty(
                    "--primary-color-light",
                    color + "20"
                  );
                }}
              />

              {/* Hex Input */}
              <div className="flex items-center mt-3">
                <span className="text-xs mr-2">Hex</span>
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => {
                    const color = e.target.value;
                    setSelectedColor(color);
                    document.documentElement.style.setProperty(
                      "--primary-color",
                      color
                    );
                    document.documentElement.style.setProperty(
                      "--primary-color-light",
                      color + "20"
                    );
                  }}
                  className="border text-xs rounded px-2 py-1 w-24"
                />
              </div>

              {/* Saved Colors */}
              <div className="mt-3">
                <p className="text-xs mb-1">Saved colors:</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <div
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-6 h-6 rounded-full cursor-pointer`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recents */}
      <div className="mt-12 mb-12">
        <div className="flex justify-between items-center mb-3 mt-6 p-1">
          <h2 className="font-semibold text-2xl">Recents</h2>
          <button className="text-[var(--primary-color)] text-md font-semibold ">
            View All
          </button>
        </div>
        <div className="flex gap-12 items-center justify-center ">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="text-center text-sm">
                <img
                  src={Recent}
                  alt="recent"
                  className="w-[300px] h-[200px]  rounded-md object-cover mb-1"
                />
                <p className="font-semibold">Bible Verse</p>
                <p className="text-gray-400 text-xs">Updated: 5 Months ago</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
