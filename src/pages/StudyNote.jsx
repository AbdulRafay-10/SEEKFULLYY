"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Share,
  Copy,
  Heart,
  FolderOpen,
  Send,
  Trash2,
  ExternalLink,
  Search,
  Folder,
  Save,
} from "lucide-react";
import Recent from "../assets/images/Recents.png";
import AllNotes from "../assets/icons/AllNotes.png";
import Bin from "../assets/icons/Bin.png";
import Favorite from "../assets/icons/Favorite.png";
import Folders from "../assets/icons/Folder.png";

const StudyNote = () => {
  const [expandedFolders, setExpandedFolders] = useState({ folders: true });
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeFolder, setActiveFolder] = useState("All Notes"); // Add this state

  const notes = [
    {
      id: 1,
      title: "Bible Verse",
      updated: "4 months ago",
      src: Recent,
    },
    {
      id: 2,
      title: "Bible Verse",
      updated: "4 months ago",
      src: Recent,
    },
    {
      id: 3,
      title: "Bible Verse",
      updated: "4 months ago",
      src: Recent,
    },
    {
      id: 4,
      title: "Bible Verse",
      updated: "4 months ago",
      src: Recent,
    },
    {
      id: 5,
      title: "Bible Verse",
      updated: "4 months ago",
      src: Recent,
    },
    {
      id: 6,
      title: "Bible Verse",
      updated: "4 months ago",
      src: Recent,
    },
  ];

  const menuItems = [
    { icon: ExternalLink, label: "Open", color: "text-gray-700" },
    { icon: Share, label: "Share", color: "text-gray-700" },
    { icon: Copy, label: "Duplicate", color: "text-gray-700" },
    { icon: Heart, label: "Favourite", color: "text-gray-700" },
    { icon: FolderOpen, label: "Move to Folder", color: "text-gray-700" },
    { icon: Save, label: "Save to files", color: "text-gray-700" },
    { icon: Trash2, label: "Delete", color: "text-red-600" },
  ];

  const toggleFolder = (folder) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folder]: !prev[folder],
    }));
  };

  const handleDropdownToggle = (noteId, event) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === noteId ? null : noteId);
  };

  const handleMenuItemClick = (action, noteId) => {
    console.log(`${action} clicked for note ${noteId}`);
    setActiveDropdown(null);
  };

  const handleFolderItemClick = (folderName) => {
    console.log(`${folderName} clicked`);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = () => {
    setActiveDropdown(null);
  };

  return (
    <div
      className="min-h-screen bg-whitey shadow-xl rounded-3xl flex flex-col"
      onClick={handleClickOutside}
    >
      {/* Header - Full Width */}
      <div className="bg-white p-4" /* borderBottom removed */>
        <div className="flex items-center justify-between">
          {/* Go Back - Left */}
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-md font-bold">Go Back</span>
          </Link>
        </div>
        <div className="flex-1 w-[800px] mx-auto mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{
                border: "1.5px solid var(--primary-color)",
                boxShadow: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Content Area - Below Header */}
      <div className="flex flex-1">
        {/* Left Sidebar - Below Header */}
        <div
          className="w-64 bg-white border-gray-200 flex flex-col"
          style={{ "var(--primary-color)":"--primary-color-light" }} // <-- This is always pink!
        >
          {/* Create New Note */}
          <div className="p-4">
            <Link to="/whiteboard">
              <button
                className="w-[260px] h-[50px] flex items-center gap-3 p-4 rounded-md transition-colors"
                style={{
                  backgroundColor: "var(--primary-color-light)",
                  color: "var(--primary-color)",
                  fontWeight: 600,
                }}
              >
                <div
                  className="rounded-full p-1"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  <Plus className="w-4 h-4" style={{ color: "white" }} />
                </div>
                <span className="text-md font-medium">Create new note</span>
              </button>
            </Link>
          </div>

          <div className="flex-1 px-4">
            {/* Folders Section */}
            <div className="mb-4 rounded-lg">
              <button
                onClick={() => toggleFolder("folders")}
                className="w-[260px] h-[50px] flex items-center justify-between p-4 rounded-md transition-colors font-medium"
                style={{
                  backgroundColor: "var(--primary-color-light)",
                  color: "var(--primary-color)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Folder
                    className="w-6 h-6"
                    style={{ color: "var(--primary-color)" }}
                  />
                  <span>Folders</span>
                </div>
                {expandedFolders.folders ? (
                  <ChevronDown
                    className="w-4 h-4"
                    style={{ color: "var(--primary-color)" }}
                  />
                ) : (
                  <ChevronRight
                    className="w-4 h-4"
                    style={{ color: "var(--primary-color)" }}
                  />
                )}
              </button>

              {expandedFolders.folders && (
                <div className="w-[260px]  bg-[#f9f9f9] rounded-md overflow-hidden ">
                  {/* Default Folders */}
                  <button
                    onClick={() => setActiveFolder("All Notes")}
                    className={`w-full flex items-center justify-between px-3 py-2 cursor-pointer text-sm transition-colors ${
                      activeFolder === "All Notes"
                        ? "bg-[#f7f7f7] text-black font-semibold"
                        : "hover:bg-gray-100 text-gray-800"
                    } `}
                  >
                    <div className="flex items-center gap-2">
                      <img src={AllNotes} alt="All Notes" className="w-4 h-4" />
                      <span>All Notes</span>
                    </div>
                    <span className="text-xs">112</span>
                  </button>
                  <button
                    onClick={() => setActiveFolder("All Notes")}
                    className={`w-full flex items-center cursor-pointer justify-between px-3 py-2 text-sm transition-colors ${
                      activeFolder === "All Notes"
                        ? "bg-[#f7f7f7] text-black font-semibold"
                        : "hover:bg-gray-100 text-gray-800"
                    } `}
                  >
                    <div className="flex items-center gap-2">
                      <img src={Favorite} alt="Favorite" className="w-4 h-4" />
                      <span>Favourites</span>
                    </div>
                    <span className="text-xs">112</span>
                  </button>
                  <button
                    onClick={() => setActiveFolder("All Notes")}
                    className={`w-full flex items-center cursor-pointer justify-between px-3 py-2 text-sm transition-colors ${
                      activeFolder === "All Notes"
                        ? "bg-[#f7f7f7] text-black font-semibold"
                        : "hover:bg-gray-100 text-gray-800"
                    } `}
                  >
                    <div className="flex items-center gap-2">
                      <img src={Bin} alt="Bin" className="w-4 h-4" />
                      <span>Recently Deleted</span>
                    </div>
                    <span className="text-xs">112</span>
                  </button>

                  {/* My Folders - moved inside dropdown */}
                  <div>
                    <div className="py-2 ml-3 text-sm font-medium text-gray-700" style={{color: "var(--primary-color)"}}>
                      My Folders
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => setActiveFolder("All Notes")}
                        className={`w-full flex items-center cursor-pointer justify-between px-3 py-2 text-sm transition-colors ${
                          activeFolder === "All Notes"
                            ? "bg-[#f7f7f7] text-black font-semibold"
                            : "hover:bg-gray-100 text-gray-800"
                        } `}
                      >
                        <div className="flex items-center gap-2">
                          <img src={Folders} alt="Folder" className="w-4 h-4" />
                          <span>Wajahat's Notes</span>
                        </div>
                        <span className="text-xs">112</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div></div>
          </div>
        </div>

        {/* Main Content - Right of Sidebar */}
        <div className="flex-1 p-6">
          {/* Notes Grid - 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notes.map((note) => (
              <div key={note.id} className="relative group">
                <div className=" bg-white overflow-hidden  ml-20">
                  {/* Note Thumbnail */}
                  <div className=" bg-white relative">
                    <img
                      src={note.src || "/placeholder.svg"}
                      alt={note.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Three Dots Menu */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => handleDropdownToggle(note.id, e)}
                        className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeDropdown === note.id && (
                        <div className="absolute top-10 right-0 w-72  bg-white border border-gray-200 rounded-md shadow-lg z-50">
                          <div className="py-1">
                            {menuItems.map((item, index) => (
                              <button
                                key={index}
                                onClick={() => handleMenuItemClick(item.label, note.id)}
                                className={`w-full flex flex-row-reverse items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${item.color}`}
                              >
                                <item.icon className="w-4 h-4" />
                                <span className="flex-1 text-left">{item.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Note Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {note.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Updated: {note.updated}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyNote;
