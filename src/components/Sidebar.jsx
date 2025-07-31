"use client"

import { useState } from "react"
import { Plus, Menu, X } from "lucide-react"
import Paint from "../assets/icons/Paint.svg"
import Community from "../assets/icons/Community.svg"
import Bible from "../assets/icons/Bible.svg"
import Study from "../assets/icons/Study.svg"
import AI from "../assets/icons/AI.svg"
import More from "../assets/icons/More.svg"
import { Link, useNavigate } from "react-router-dom"
import CreateDesignModal from "./home/CreateDesignModal"

const navItems = [
  { label: "VM", icon: Paint, id: "vm", route: "/" },
  { label: "COMMUNITY", icon: Community, id: "community", route: "/community" },
  { label: "BIBLE", icon: Bible, id: "bible", route: "/bible" },
  { label: "STUDY", icon: Study, id: "study", route: "/study" },
  { label: "SEEKER AI", icon: AI, id: "ai", route: "/ai" },
  { label: "MORE", icon: More, id: "more", route: "/more" },
]

const Sidebar = () => {
  const [active, setActive] = useState("vm")
  const [isOpen, setIsOpen] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const navigate = useNavigate()

  const handleNavigateToWhiteboard = (options = {}) => {
  if (options.uploadedFiles) {
    navigate("/whiteboard", { 
      state: { 
        uploadedFiles: options.uploadedFiles,
        canvasSize: { width: 1200, height: 800 } // Default size when uploading files
      } 
    })
  } else if (options.width && options.height) {
    navigate("/whiteboard", { 
      state: { 
        canvasSize: { width: options.width, height: options.height } 
      } 
    })
  } else {
    // Default size for regular whiteboard
    navigate("/whiteboard", { 
      state: { 
        canvasSize: { width: 1200, height: 800 } 
      } 
    })
  }
}

  return (
    <>
      {/* Hamburger (Mobile Only) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsOpen(true)} className="p-2">
          <Menu size={28} className="text-[var(--primary-color)]" />
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black opacity-30 transition-opacity duration-300 ${
          isOpen ? "opacity-30 visible" : "opacity-0 invisible"
        } md:hidden`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white w-64 transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:w-20 md:flex md:flex-col md:items-center md:mt-5`}
      >
        {/* Full-height container with spacing between top & bottom */}
        <div className="flex flex-col justify-between h-full w-full py-6">
          {/* Top: Create + Nav */}
          <div className="flex flex-col items-center gap-6">
            {/* Close button (Mobile only) */}
            <div className="flex justify-end md:hidden w-full px-4">
              <button onClick={() => setIsOpen(false)}>
                <X size={24} className="text-gray-700" />
              </button>
            </div>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl"
              style={{ backgroundColor: "var(--primary-color)" }}
            >
              <Plus size={24} />
            </button>
            <span className="text-xs font-semibold text-[var(--primary-color)] -mt-2 text-center block">CREATE</span>

            {/* Navigation Items */}
            <div className="flex flex-col items-center gap-6 mt-6">
              {navItems.map((item) => (
                <Link to={item.route} key={item.id} className="w-full flex justify-center">
                  <div
                    onClick={() => {
                      setActive(item.id)
                      setIsOpen(false) // Close sidebar on mobile
                    }}
                    className={`flex flex-col items-center cursor-pointer transition ${
                      active === item.id ? "rounded-xl bg-[var(--primary-color-light)] px-3 py-2" : ""
                    }`}
                  >
                    <img src={item.icon || "/placeholder.svg"} alt={item.label} className="w-[40px] h-[40px]" />
                    <span className="text-[10px] text-gray-700 mt-1 text-center font-medium">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Optional: Bottom Section (e.g. Logout, Profile, etc.) */}
          <div className="hidden md:block mb-4"></div>
        </div>
      </aside>

      {/* Create Design Modal */}
      <CreateDesignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onNavigateToWhiteboard={handleNavigateToWhiteboard}
      />
    </>
  )
}

export default Sidebar
