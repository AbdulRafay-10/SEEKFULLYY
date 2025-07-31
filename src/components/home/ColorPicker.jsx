"use client"

import { useState } from "react"

const ColorPicker = ({ color, onChange, label = "Color" }) => {
  const [isOpen, setIsOpen] = useState(false)

  const predefinedColors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#6b7280",
    "#000000",
    "#ffffff",
    "#fbbf24",
    "#84cc16",
    "#166534",
    "#dc2626",
    "#7c3aed",
    "#db2777",
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
      >
        <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color }} />
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-64">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Predefined Colors</label>
                <div className="grid grid-cols-8 gap-2">
                  {predefinedColors.map((presetColor) => (
                    <button
                      key={presetColor}
                      className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: presetColor }}
                      onClick={() => {
                        onChange(presetColor)
                        setIsOpen(false)
                      }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Custom Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full h-10 rounded border border-gray-300"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Hex Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="#000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ColorPicker
