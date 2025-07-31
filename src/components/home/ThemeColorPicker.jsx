"use client"
import { useState } from "react"
import { HexColorPicker } from "react-colorful"
import { useTheme } from "../../context/ThemeContext"

const ThemeColorPicker = ({ showPicker, onToggle }) => {
  const { primaryColor, setPrimaryColor } = useTheme()
  const [hexValue, setHexValue] = useState(primaryColor)

  // Preset theme colors - matching home page
  const colors = ["#C0392B", "#D8A39D", "#A89F91", "#3C3E50", "#D4A017"]

  const handleColorChange = (newColor) => {
    setHexValue(newColor)
    setPrimaryColor(newColor)
  }

  const handleHexInputChange = (e) => {
    const value = e.target.value
    setHexValue(value)
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setPrimaryColor(value)
    }
  }

  const handleSavedColorClick = (savedColor) => {
    handleColorChange(savedColor)
    onToggle()
  }

  if (!showPicker) return null

  return (
    <div className="absolute right-0 top-14 bg-white border shadow-lg p-4 rounded-md z-50 w-64">
      {/* Color Picker */}
      <HexColorPicker color={primaryColor} onChange={handleColorChange} />

      {/* Hex Input */}
      <div className="flex items-center mt-3">
        <span className="text-xs mr-2">Hex</span>
        <input
          type="text"
          value={hexValue}
          onChange={handleHexInputChange}
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
              onClick={() => handleSavedColorClick(color)}
              className="w-6 h-6 rounded-full cursor-pointer"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeColorPicker
