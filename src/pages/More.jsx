"use client"

import { useState } from "react"
import ProfileImg from "../assets/images/ProfileImg.png"
import Mail from "../assets/icons/Mail.svg"
import { ChevronRight } from "lucide-react"
import DarkModeIcon from "../assets/icons/Dark.png"
import LogoutIcon from "../assets/icons/logout.png"
import ProfileIcon from "../assets/icons/ProfileCircle.png"
import NotificationIcon from "../assets/icons/Notification.png"
import BookmarkIcon from "../assets/icons/BookMark.png"
import HighlightsIcon from "../assets/icons/idea.png"
import NoteIcon from "../assets/icons/Note.png"
import ActivityIcon from "../assets/icons/Activity.png"
import GivingIcon from "../assets/icons/Give.png"
import ShareIcon from "../assets/icons/Share.png"
import { LogOut  } from "lucide-react"
import { Link } from "react-router-dom"

const More = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const settings = [
    { label: "Profile", icon: ProfileIcon , path:"/more/profile"},
    { label: "Notification", icon: NotificationIcon },
    { label: "Bookmark", icon: BookmarkIcon , path:"/more/bookmark"},
    { label: "Highlights", icon: HighlightsIcon , path:"/more/highlighted" },
    { label: "Note", icon: NoteIcon , path:"/more/notes"},
    { label: "Activity Tracker", icon: ActivityIcon, path:"/more/activity-tracker"},
    { label: "Giving", icon: GivingIcon , path:"/more/giving"},
    { label: "Share Seekfully", icon: ShareIcon ,  path:"/more/about"}, 
  ]

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  return (
    <div className="mx-auto  rounded-3xl shadow-xl ">
      {/* Profile Section */}
      <div className="flex flex-col bg-gradient-to-b from-gray-100 via-gray-50 to-white items-center mb-8 rounded-3xl pt-10 ">
        <div className="mb-4">
          <img
            src={ProfileImg || "/placeholder.svg"}
            alt="Profile"
            className="rounded-full w-32 h-32 object-cover border-2 " style={{borderColor: "var(--primary-color)"}}
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bernard Ward</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <img src={Mail || "/placeholder.svg"} alt="Email" className="w-4 h-4" />
          <span className="text-sm">Bernardward@gmail.com</span>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4  p-8">
        {settings.map((item, i) => (
  <Link to={item.path} key={i}>
    <div
      className="flex items-center justify-between p-4 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl cursor-pointer transition-colors duration-200"
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#efeff3] flex items-center justify-center">
          <img src={item.icon || "/placeholder.svg"} alt={item.label} className="w-6 h-6" />
        </div>
        <span className="font-medium text-gray-900 text-sm">{item.label}</span>
      </div>
      <ChevronRight className="text-gray-400 w-5 h-5" />
    </div>
  </Link>
))}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col md:flex-row gap-4 mt-[-45px]  p-8">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between h-[80px] p-4 bg-white border border-gray-200 rounded-xl flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#efeff3] flex items-center justify-center">
              <img src={DarkModeIcon || "/placeholder.svg"} alt="Dark Mode" className="w-6 h-6" />
            </div>
            <span className="font-medium text-gray-900 text-sm">Switch to dark mode</span>
          </div>

          {/* Custom Toggle Switch */}
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              isDarkMode ? "" : "bg-gray-300"
            }`}
            style={{
              backgroundColor: isDarkMode ? "var(--primary-color)" : undefined,
            }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                isDarkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Logout Button */}
        <button className="flex items-center justify-center h-[70px] p-4 bg-white border border-gray-200 rounded-full flex-1 font-semibold text-sm text-red-500 hover:bg-red-50 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <LogOut className="w-8 h-8" style={{ color: "var(--primary-color)" }}/>
            </div>
            <span className="font-medium text-2xl" style={{ color: "var(--primary-color)" }}>Logout</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default More
