"use client"

import { useState, useEffect } from "react"
import { HexColorPicker } from "react-colorful"
import { X, Pipette, RotateCcw } from "lucide-react"

const CustomColorPicker = ({
  color,
  onChange,
  showPicker,
  onToggle,
  position = "left",
  savedColors = [],
  onSaveColor,
}) => {
  const [hexValue, setHexValue] = useState(color)
  const [activeTab, setActiveTab] = useState("SOLID")

  // Gradient states
  const [gradientType, setGradientType] = useState("linear")
  const [gradientDirection, setGradientDirection] = useState(0)
  const [gradientStops, setGradientStops] = useState([
    { color: "#ff0000", position: 0 },
    { color: "#0000ff", position: 100 },
  ])
  const [selectedStop, setSelectedStop] = useState(0)

  useEffect(() => {
    setHexValue(color)
  }, [color])

  useEffect(() => {}, [showPicker])

  if (!showPicker) {
    return null
  }

  const handleColorChange = (newColor) => {
    setHexValue(newColor)
    if (activeTab === "SOLID") {
      onChange(newColor)
    } else {
      // Update gradient stop color
      const newStops = [...gradientStops]
      newStops[selectedStop].color = newColor
      setGradientStops(newStops)
      updateGradientBackground(newStops)
    }
  }

  const handleHexInputChange = (e) => {
    const value = e.target.value
    setHexValue(value)
    if (/^#[0-9A-Fa-f]{6}$/i.test(value)) {
      setHexValue(value)
      if (activeTab === "SOLID") {
        onChange(value) // Make sure this is called
      } else {
        const newStops = [...gradientStops]
        newStops[selectedStop].color = value
        setGradientStops(newStops)
        updateGradientBackground(newStops)
      }
    }
  }

  const updateGradientBackground = (stops = gradientStops) => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position)
    const colorStops = sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")

    let gradient
    if (gradientType === "linear") {
      gradient = `linear-gradient(${gradientDirection}deg, ${colorStops})`
    } else {
      gradient = `radial-gradient(circle, ${colorStops})`
    }

    onChange(gradient)
  }

  const addGradientStop = () => {
    const newPosition = 50 // Add in middle
    const newStop = { color: "#ffffff", position: newPosition }
    const newStops = [...gradientStops, newStop]
    setGradientStops(newStops)
    setSelectedStop(newStops.length - 1)
    updateGradientBackground(newStops)
  }

  const removeGradientStop = (index) => {
    if (gradientStops.length <= 2) return // Keep at least 2 stops
    const newStops = gradientStops.filter((_, i) => i !== index)
    setGradientStops(newStops)
    setSelectedStop(Math.min(selectedStop, newStops.length - 1))
    updateGradientBackground(newStops)
  }

  const updateStopPosition = (index, position) => {
    const newStops = [...gradientStops]
    newStops[index].position = Math.max(0, Math.min(100, position))
    setGradientStops(newStops)
    updateGradientBackground(newStops)
  }

  const handleSavedColorClick = (savedColor) => {
    handleColorChange(savedColor)
  }

  const handleSaveColor = () => {
    if (onSaveColor && !savedColors.includes(hexValue)) {
      onSaveColor(hexValue)
    }
  }

  const handleDropperClick = () => {
    // Eyedropper API functionality
    if ("EyeDropper" in window) {
      const eyeDropper = new window.EyeDropper()
      eyeDropper
        .open()
        .then((result) => {
          handleColorChange(result.sRGBHex)
        })
        .catch((e) => {
          console.log("User cancelled the selection")
        })
    } else {
      alert("EyeDropper API is not supported in this browser")
    }
  }

  // Predefined gradients
  const predefinedGradients = [
    "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
    "linear-gradient(135deg, #667eea, #764ba2)",
    "linear-gradient(90deg, #ff9a9e, #fecfef)",
    "linear-gradient(180deg, #a8edea, #fed6e3)",
    "radial-gradient(circle, #ff6b6b, #4ecdc4)",
    "radial-gradient(circle, #667eea, #764ba2)",
    "linear-gradient(45deg, #ffecd2, #fcb69f)",
    "linear-gradient(135deg, #a8caba, #5d4e75)",
  ]

  // Rainbow colors palette
  const rainbowColors = [
    // Row 1 - Light colors
    ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#E1BAFF"],
    // Row 2 - Medium colors
    ["#FF9AA2", "#FFB347", "#FFFF66", "#98FB98", "#87CEEB", "#DDA0DD"],
    // Row 3 - Bright colors
    ["#FF6B6B", "#FF8C00", "#FFD700", "#32CD32", "#1E90FF", "#9370DB"],
    // Row 4 - Dark colors
    ["#DC143C", "#FF4500", "#FFA500", "#228B22", "#4169E1", "#8A2BE2"],
    // Row 5 - Very dark colors
    ["#8B0000", "#B22222", "#DAA520", "#006400", "#000080", "#4B0082"],
    // Row 6 - Grays
    ["#F5F5F5", "#D3D3D3", "#A9A9A9", "#808080", "#696969", "#2F2F2F"],
  ]

  if (!showPicker) return null

  // Sidebar position (slides from left)
  if (position === "sidebar") {
    return (
      // Removed the fixed positioning and overlay from here.
      // The parent WhiteBoard component will handle the fixed positioning and backdrop.
      <div className="p-6 h-full overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">BACKGROUND COLOR</h3>
          <button
            onClick={(e) => {
              onToggle()
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            onClick={() => setActiveTab("SOLID")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "SOLID" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            SOLID
          </button>
          <button
            onClick={() => setActiveTab("GRADIENT")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "GRADIENT"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            GRADIENT
          </button>
        </div>

        {activeTab === "SOLID" && (
          <>
            {/* Color Picker */}
            <div className="mb-6">
              <HexColorPicker
                color={hexValue}
                onChange={handleColorChange}
                style={{ width: "100%", height: "200px" }}
              />
            </div>

            {/* Hex Input with Dropper */}
            <div className="flex items-center mb-6">
              <div className="flex items-center border rounded-md px-3 py-2 flex-1">
                <span className="text-sm text-gray-600 mr-2">#</span>
                <input
                  type="text"
                  value={hexValue.replace("#", "")}
                  onChange={(e) => handleHexInputChange("#" + e.target.value)}
                  className="flex-1 text-sm outline-none"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              <button
                onClick={handleDropperClick}
                className="ml-2 p-2 border rounded-md hover:bg-gray-50 transition-colors"
                title="Pick color from screen"
              >
                <Pipette className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Rainbow Colors Section */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                RAINBOW COLORS
                <button className="text-xs text-gray-500 hover:text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </h4>
              <div className="grid grid-cols-6 gap-2">
                {rainbowColors.flat().map((colorOption, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorChange(colorOption)}
                    className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors shadow-sm"
                    style={{ backgroundColor: colorOption }}
                  />
                ))}
              </div>
            </div>

            {/* Your Colors Section */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                YOUR COLORS
                <button className="text-xs text-gray-500 hover:text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </h4>

              {savedColors.length > 0 ? (
                <div className="grid grid-cols-6 gap-2">
                  {savedColors.map((savedColor, index) => (
                    <button
                      key={index}
                      onClick={() => handleSavedColorClick(savedColor)}
                      className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors shadow-sm"
                      style={{ backgroundColor: savedColor }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 mb-2">Recently used</p>
                  <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto"></div>
                </div>
              )}

              <button
                onClick={handleSaveColor}
                className="w-full mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Current Color
              </button>
            </div>
          </>
        )}

        {activeTab === "GRADIENT" && (
          <>
            {/* Gradient Type Selection */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">GRADIENT TYPE</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setGradientType("linear")
                    updateGradientBackground()
                  }}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    gradientType === "linear" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Linear
                </button>
                <button
                  onClick={() => {
                    setGradientType("radial")
                    updateGradientBackground()
                  }}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    gradientType === "radial" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Radial
                </button>
              </div>
            </div>

            {/* Gradient Direction (Linear only) */}
            {gradientType === "linear" && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">DIRECTION</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={gradientDirection}
                    onChange={(e) => {
                      setGradientDirection(Number(e.target.value))
                      updateGradientBackground()
                    }}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-12">{gradientDirection}°</span>
                  <button
                    onClick={() => {
                      setGradientDirection(0)
                      updateGradientBackground()
                    }}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <RotateCcw className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            )}

            {/* Gradient Preview */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">PREVIEW</h4>
              <div
                className="w-full h-16 rounded-md border border-gray-200"
                style={{
                  background:
                    gradientType === "linear"
                      ? `linear-gradient(${gradientDirection}deg, ${gradientStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})`
                      : `radial-gradient(circle, ${gradientStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})`,
                }}
              />
            </div>

            {/* Color Stops */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">COLOR STOPS</h4>
                <button
                  onClick={addGradientStop}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Add Stop
                </button>
              </div>

              <div className="space-y-3">
                {gradientStops.map((stop, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-2 rounded border ${
                      selectedStop === index ? "border-blue-400 bg-blue-50" : "border-gray-200"
                    }`}
                    onClick={() => {
                      setSelectedStop(index)
                      setHexValue(stop.color)
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: stop.color }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stop.position}
                      onChange={(e) => updateStopPosition(index, Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-600 w-8">{stop.position}%</span>
                    {gradientStops.length > 2 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeGradientStop(index)
                        }}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Color Picker for Selected Stop */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">EDIT STOP {selectedStop + 1}</h4>
              <HexColorPicker
                color={gradientStops[selectedStop]?.color || "#000000"}
                onChange={handleColorChange}
                style={{ width: "100%", height: "150px" }}
              />
            </div>

            {/* Hex Input for Selected Stop */}
            <div className="flex items-center mb-6">
              <div className="flex items-center border rounded-md px-3 py-2 flex-1">
                <span className="text-sm text-gray-600 mr-2">#</span>
                <input
                  type="text"
                  value={(gradientStops[selectedStop]?.color || "#000000").replace("#", "")}
                  onChange={(e) => handleHexInputChange("#" + e.target.value)}
                  className="flex-1 text-sm outline-none"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
              <button
                onClick={handleDropperClick}
                className="ml-2 p-2 border rounded-md hover:bg-gray-50 transition-colors"
                title="Pick color from screen"
              >
                <Pipette className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Predefined Gradients */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">PRESET GRADIENTS</h4>
              <div className="grid grid-cols-2 gap-2">
                {predefinedGradients.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => onChange(gradient)}
                    className="h-12 rounded-md border border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ background: gradient }}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Regular dropdown position
  let positionClass = "top-full right-0"
  if (position === "right") {
    positionClass = "top-full left-0"
  } else if (position === "right-top") {
    positionClass = "bottom-full left-0 mb-2"
  }

  return (
    <div className={`absolute ${positionClass} mt-2 z-50`}>
      <div className="fixed inset-0" onClick={onToggle} />
      <div className="bg-white border shadow-lg p-4 rounded-md w-64 z-50 relative">
        {/* Color Picker */}
        <HexColorPicker color={hexValue} onChange={handleColorChange} />

        {/* Hex Input */}
        <div className="flex items-center mt-3">
          <span className="text-xs mr-2">Hex</span>
          <input
            type="text"
            value={hexValue}
            onChange={handleHexInputChange}
            className="border text-xs rounded px-2 py-1 w-24"
            placeholder="#000000"
          />
          <button
            onClick={handleSaveColor}
            className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>

        {/* Saved Colors */}
        {savedColors.length > 0 && (
          <div className="mt-3">
            <p className="text-xs mb-1">Saved colors:</p>
            <div className="flex flex-wrap gap-2">
              {savedColors.map((savedColor) => (
                <div
                  key={savedColor}
                  onClick={() => handleSavedColorClick(savedColor)}
                  className="w-6 h-6 rounded-full cursor-pointer border border-gray-200 hover:border-gray-400 transition-colors"
                  style={{ backgroundColor: savedColor }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomColorPicker
