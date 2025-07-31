"use client"

import { useState } from "react"
import { X, Cloud, Square, Palette, Instagram, Facebook } from "lucide-react"

const CreateDesignModal = ({ isOpen, onClose, onNavigateToWhiteboard }) => {
  const [selectedCategory, setSelectedCategory] = useState("whiteboard")
  const [customWidth, setCustomWidth] = useState("")
  const [customHeight, setCustomHeight] = useState("")
  const [selectedUnit, setSelectedUnit] = useState("px")
  const [uploadedFiles, setUploadedFiles] = useState([])

  const sidebarOptions = [
    { id: "whiteboard", label: "Whiteboards", icon: <Square className="w-5 h-5" /> },
    { id: "custom-size", label: "Custom size", icon: <Palette className="w-5 h-5" /> },
    { id: "insta-sizes", label: "Instagram Sizes", icon: <Instagram className="w-5 h-5" /> },
    { id: "facebook-sizes", label: "Facebook Sizes", icon: <Facebook className="w-5 h-5" /> },
    { id: "tiktok-sizes", label: "TikTok Sizes", icon: "🎵" },
    { id: "upload", label: "Upload", icon: <Cloud className="w-5 h-5" /> },
  ]

  const instaSizes = [
    { name: "Instagram Story", width: 1080, height: 1920, description: "1080 × 1920 px" },
    { name: "Instagram Post", width: 1080, height: 1080, description: "1080 × 1080 px" },
    { name: "Instagram Reel", width: 1080, height: 1920, description: "1080 × 1920 px" },
  ]

  const facebookSizes = [
    { name: "Facebook Post", width: 1200, height: 630, description: "1200 × 630 px" },
    { name: "Facebook Story", width: 1080, height: 1920, description: "1080 × 1920 px" },
    { name: "Facebook Reel", width: 1080, height: 1920, description: "1080 × 1920 px" },
  ]

  const tiktokSizes = [
    { name: "TikTok Reel", width: 1080, height: 1920, description: "1080 × 1920 px" },
    { name: "TikTok Story", width: 1080, height: 1920, description: "1080 × 1920 px" },
  ]

  const handleCreateCustomSize = () => {
  const width = Number.parseInt(customWidth);
  const height = Number.parseInt(customHeight);
  if (width && height) {
    onNavigateToWhiteboard({ width, height });
    onClose();
  }
}
  const handlePresetSize = (width, height) => {
  onNavigateToWhiteboard({ width, height });
  onClose();
}

  const handleWhiteboardClick = () => {
    onNavigateToWhiteboard()
    onClose()
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    const filePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            name: file.name,
            type: file.type,
            data: e.target.result,
            file: file,
          })
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(filePromises).then((uploadedFiles) => {
      setUploadedFiles(uploadedFiles)
      // Navigate to whiteboard with uploaded files
      onNavigateToWhiteboard({ uploadedFiles })
      onClose()
    })
  }

  const renderContent = () => {
    switch (selectedCategory) {
      case "whiteboard":
        return (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Square className="w-12 h-12 text-gray-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Whiteboard</h2>
              <p className="text-gray-600 mb-6">Create on an infinite canvas</p>
              <button
                onClick={handleWhiteboardClick}
                className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Create Whiteboard
              </button>
            </div>
          </div>
        )

      case "custom-size":
        return (
          <div className="flex-1 p-8">
            <h2 className="text-2xl font-semibold mb-6">Custom size</h2>
            <div className="max-w-md">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    placeholder="Width"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                    placeholder="Height"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Units</label>
                  <select
                    value={selectedUnit}
                    onChange={(e) => setSelectedUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  >
                    <option value="px">px</option>
                    <option value="in">in</option>
                    <option value="cm">cm</option>
                    <option value="mm">mm</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleCreateCustomSize}
                disabled={!customWidth || !customHeight}
                className="w-full px-6 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create new design
              </button>
            </div>
          </div>
        )

      case "insta-sizes":
        return (
          <div className="flex-1 p-8">
            <h2 className="text-2xl font-semibold mb-6">Instagram Sizes</h2>
            <div className="grid grid-cols-1 gap-4 max-w-md">
              {instaSizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetSize(size.width, size.height)}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[var(--primary-color)] hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <div className="font-medium">{size.name}</div>
                    <div className="text-sm text-gray-500">{size.description}</div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-white" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case "facebook-sizes":
        return (
          <div className="flex-1 p-8">
            <h2 className="text-2xl font-semibold mb-6">Facebook Sizes</h2>
            <div className="grid grid-cols-1 gap-4 max-w-md">
              {facebookSizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetSize(size.width, size.height)}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[var(--primary-color)] hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <div className="font-medium">{size.name}</div>
                    <div className="text-sm text-gray-500">{size.description}</div>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Facebook className="w-6 h-6 text-white" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case "tiktok-sizes":
        return (
          <div className="flex-1 p-8">
            <h2 className="text-2xl font-semibold mb-6">TikTok Sizes</h2>
            <div className="grid grid-cols-1 gap-4 max-w-md">
              {tiktokSizes.map((size, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetSize(size.width, size.height)}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[var(--primary-color)] hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <div className="font-medium">{size.name}</div>
                    <div className="text-sm text-gray-500">{size.description}</div>
                  </div>
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white text-2xl">🎵</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case "upload":
        return (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-6 text-center">Upload</h2>
              <div className="flex items-center justify-center">
                <div className="w-80 h-80 rounded-lg p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer flex flex-col items-center justify-center">
                  <Cloud className="w-24 h-24 text-gray-400 mb-6" />
                  <h3 className="text-xl font-medium mb-3">Upload file</h3>
                  <p className="text-gray-500 mb-6">Drag and drop your files here or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf"
                    className="hidden"
                    id="file-upload"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-8 py-4 bg-[var(--primary-color)] text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer text-lg"
                  >
                    Choose Files
                  </label>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
              <p className="text-gray-600">This feature is under development</p>
            </div>
          </div>
        )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 opacity-100 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex h-[80vh]">
          {/* Left Sidebar */}
          <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Create a design</h1>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {sidebarOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedCategory(option.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      selectedCategory === option.id
                        ? "bg-[var(--primary-color-light)] text-[var(--primary-color)]"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col">{renderContent()}</div>
        </div>
      </div>
    </div>
  )
}

export default CreateDesignModal
