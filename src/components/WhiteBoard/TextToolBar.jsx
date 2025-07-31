"use client"

import { useState, useRef, useEffect } from "react"
import {
  ChevronDown,
  Minus,
  Plus,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Upload,
} from "lucide-react"
import CustomColorPicker from "./CustomColorPicker"

const defaultTextSettings = {
  fontSize: 16,
  fontFamily: "Arial",
  letterSpacing: 0,
  lineHeight: 1.2,
  color: "#000000",
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
  uppercase: false,
  align: "left",
}

const TextToolbar = ({
  textSettings,
  onTextSettingsChange,
  selectedElementProps,
  onApplyStyleToSelectedText,
  onClose,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showFontDropdown, setShowFontDropdown] = useState(false)
  const [showSpacingDropdown, setShowSpacingDropdown] = useState(false)
  const [isUploadingFont, setIsUploadingFont] = useState(false)
  const [customFonts, setCustomFonts] = useState([])

  const spacingRef = useRef(null)
  const fontDropdownRef = useRef(null)
  const fileInputRef = useRef(null)

  const currentSettings = selectedElementProps
    ? {
        ...defaultTextSettings,
        ...selectedElementProps,
        fontSize: Math.round(selectedElementProps.fontSize || defaultTextSettings.fontSize),
      }
    : {
        ...defaultTextSettings,
        ...textSettings,
        fontSize: Math.round(textSettings.fontSize || defaultTextSettings.fontSize),
      }

   const defaultFonts = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Verdana",
    "Georgia",
    "Palatino",
    "Garamond",
    "Bookman",
    "Comic Sans MS",
    "Trebuchet MS",
    "Arial Black",
    "Impact",
    "Montserrat",
    "Roboto",
    "Open Sans",
    "Lato",
    "Source Sans Pro",
  ]

  const fonts = [...defaultFonts, ...customFonts]
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72, 96, 120]

   const handleFontUpload = (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploadingFont(true)
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const fontName = file.name.replace(/\.[^/.]+$/, "")
        const fontUrl = event.target.result
        const fontFamily = `Custom-${fontName}-${Date.now()}`
        
        const fontFace = new FontFace(fontFamily, `url(${fontUrl})`)
        
        fontFace.load().then((loadedFace) => {
          document.fonts.add(loadedFace)
          setCustomFonts(prev => [...prev, fontFamily])
          setIsUploadingFont(false)
        }).catch(err => {
          console.error('Font loading failed:', err)
          setIsUploadingFont(false)
        })
      }
      reader.readAsDataURL(file)
    })
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const letterSpacingMin = -10
  const letterSpacingMax = 100
  const letterSpacingStep = 1

  const lineHeightMin = 0.5
  const lineHeightMax = 4.0
  const lineHeightStep = 0.01

  // FIXED: Improved font size handling
  const handleFontSizeChange = (increment) => {
  const currentFontSize = Math.round(currentSettings.fontSize) // Round to nearest integer
  let newFontSize

  if (increment) {
    // Find next larger size or increment by 2 if not in predefined sizes
    const nextSize = fontSizes.find((size) => size > currentFontSize)
    newFontSize = nextSize || Math.min(currentFontSize + 2, 120) // Changed from +1 to +2
  } else {
    // Find next smaller size or decrement by 2 if not in predefined sizes
    const prevSize = [...fontSizes].reverse().find((size) => size < currentFontSize)
    newFontSize = prevSize || Math.max(currentFontSize - 2, 8) // Changed from -1 to -2
  }

  if (selectedElementProps) {
    onApplyStyleToSelectedText({ fontSize: newFontSize })
  } else {
    onTextSettingsChange({ ...textSettings, fontSize: newFontSize })
  }
}

  // FIXED: Direct font size input handling
  const handleDirectFontSizeChange = (value) => {
  let newFontSize = Math.max(8, Math.min(Number.parseInt(value) || 8, 120))
  
  // If the value is odd, make it even by rounding to nearest multiple of 2
  if (newFontSize % 2 !== 0) {
    newFontSize = Math.round(newFontSize / 2) * 2
  }

  if (selectedElementProps) {
    onApplyStyleToSelectedText({ fontSize: newFontSize })
  } else {
    onTextSettingsChange({ ...textSettings, fontSize: newFontSize })
  }
}

  const handleLetterSpacingChange = (value) => {
    const newLetterSpacing = Number(value)
    if (selectedElementProps) {
      onApplyStyleToSelectedText({ letterSpacing: newLetterSpacing })
    } else {
      onTextSettingsChange({ ...textSettings, letterSpacing: newLetterSpacing })
    }
  }

  const handleLineHeightChange = (value) => {
    const newLineHeight = Number(value)
    if (selectedElementProps) {
      onApplyStyleToSelectedText({ lineHeight: newLineHeight })
    } else {
      onTextSettingsChange({ ...textSettings, lineHeight: newLineHeight })
    }
  }

  const toggleStyle = (style) => {
    const newValue = !currentSettings[style]
    if (selectedElementProps) {
      onApplyStyleToSelectedText({ [style]: newValue })
    } else {
      onTextSettingsChange({ ...textSettings, [style]: newValue })
    }
  }

  const handleColorChange = (color) => {
    if (selectedElementProps) {
      onApplyStyleToSelectedText({ color })
    } else {
      onTextSettingsChange({ ...textSettings, color })
    }
  }

  const handleAlignChange = (align) => {
    if (selectedElementProps) {
      onApplyStyleToSelectedText({ align })
    } else {
      onTextSettingsChange({ ...textSettings, align })
    }
  }

  const handleFontFamilyChange = (fontFamily) => {
    if (selectedElementProps) {
      onApplyStyleToSelectedText({ fontFamily })
    } else {
      onTextSettingsChange({ ...textSettings, fontFamily })
    }
  }

    useEffect(() => {
    const handleClickOutside = (event) => {
      if (spacingRef.current && !spacingRef.current.contains(event.target) && 
          !event.target.closest(".spacing-toggle")) {
        setShowSpacingDropdown(false)
      }
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target) && 
          !event.target.closest(".font-dropdown-toggle")) {
        setShowFontDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="mb-8 flex justify-center fixed left-72 z-50 rounded-lg">
      <div className="relative">
        <div className="rounded-xl min-w-0 h-full p-2 flex items-center gap-3 bg-white border border-[#d7dade]">
          {/* Font Family Dropdown - Corrected Structure */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowFontDropdown(!showFontDropdown)
              }}
              className="font-dropdown-toggle flex items-center gap-2 px-6 py-2 border-2 border-[#d7dade] rounded-md hover:border-gray-400 transition-colors min-w-[120px] justify-between"
            >
              <span className="text-sm truncate">{currentSettings.fontFamily}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showFontDropdown && (
              <div 
                ref={fontDropdownRef}
                className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 w-64 max-h-96 overflow-y-auto"
              >
                {/* Font Upload Section */}
                <div className="p-3 border-b border-gray-100">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      triggerFileInput()
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    disabled={isUploadingFont}
                  >
                    <Upload className="w-4 h-4" />
                    {isUploadingFont ? 'Uploading...' : 'Upload Font'}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFontUpload}
                    accept=".ttf,.otf,.woff,.woff2"
                    multiple
                    style={{ display: 'none' }}
                  />
                </div>
                
                {/* Font List */}
                <div className="max-h-64 overflow-y-auto">
                  {fonts.map((font) => (
                    <button
                      key={font}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleFontFamilyChange(font)
                        setShowFontDropdown(false)
                      }}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors"
                      style={{ fontFamily: font }}
                    >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>
             
            )}
          </div>

          {/* FIXED: Font Size Controls with direct input */}
          <div className="flex items-center gap-1 border-2 border-[#d7dade] rounded-md">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleFontSizeChange(false)
              }}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
  type="number"
  min="8"
  max="120"
  step="2" // Add this to enforce stepping by 2
  value={Math.round(currentSettings.fontSize)}
  onChange={(e) => handleDirectFontSizeChange(e.target.value)}
  onClick={(e) => e.stopPropagation()}
  onFocus={(e) => e.target.select()}
  className="px-2 py-2 text-sm font-medium min-w-[50px] text-center border-0 outline-none bg-transparent"
  style={{ appearance: "textfield" }}
/>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleFontSizeChange(true)
              }}
              className="p-2 hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Combined Spacing Dropdown */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowSpacingDropdown(!showSpacingDropdown)
              }}
              className="spacing-toggle p-2 border-2 border-[#d7dade] rounded-md hover:bg-gray-100 transition-colors"
            >
              <Type className="w-4 h-4" />
            </button>
            {showSpacingDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowSpacingDropdown(false)
                  }}
                />
                <div
                  ref={spacingRef}
                  className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 p-4 w-64"
                >
                  {/* Letter Spacing */}
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Letter spacing</h4>
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="range"
                      min={letterSpacingMin}
                      max={letterSpacingMax}
                      step={letterSpacingStep}
                      value={currentSettings.letterSpacing}
                      onChange={(e) => handleLetterSpacingChange(e.target.value)}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
                      style={{
                        "--value": currentSettings.letterSpacing,
                        "--min": letterSpacingMin,
                        "--max": letterSpacingMax,
                      }}
                    />
                    <input
                      type="number"
                      min={letterSpacingMin}
                      max={letterSpacingMax}
                      step={letterSpacingStep}
                      value={currentSettings.letterSpacing}
                      onChange={(e) => handleLetterSpacingChange(e.target.value)}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md text-center"
                    />
                  </div>

                  {/* Line Spacing */}
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Line spacing</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={lineHeightMin}
                      max={lineHeightMax}
                      step={lineHeightStep}
                      value={currentSettings.lineHeight}
                      onChange={(e) => handleLineHeightChange(e.target.value)}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
                      style={{ "--value": currentSettings.lineHeight, "--min": lineHeightMin, "--max": lineHeightMax }}
                    />
                    <input
                      type="number"
                      min={lineHeightMin}
                      max={lineHeightMax}
                      step={lineHeightStep}
                      value={currentSettings.lineHeight.toFixed(2)}
                      onChange={(e) => handleLineHeightChange(e.target.value)}
                      className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md text-center"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Text Style Buttons */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleStyle("bold")
            }}
            className={`p-2 rounded-md transition-colors ${
              currentSettings.bold ? "bg-blue-100 border-blue-300" : "hover:bg-gray-100"
            }`}
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleStyle("italic")
            }}
            className={`p-2 border-gray-300 rounded-md transition-colors ${
              currentSettings.italic ? "bg-blue-100 border-blue-300" : "hover:bg-gray-100"
            }`}
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleStyle("underline")
            }}
            className={`p-2 border-gray-300 rounded-md transition-colors ${
              currentSettings.underline ? "bg-blue-100 border-blue-300" : "hover:bg-gray-100"
            }`}
          >
            <Underline className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleStyle("strikethrough")
            }}
            className={`p-2 border-gray-300 rounded-md transition-colors ${
              currentSettings.strikethrough ? "bg-blue-100 border-blue-300" : "hover:bg-gray-100"
            }`}
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          {/* Text Case */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleStyle("uppercase")
            }}
            className={`p-2 border-gray-300 rounded-md transition-colors text-xs font-bold ${
              currentSettings.uppercase ? "bg-blue-100 border-blue-300" : "hover:bg-gray-100"
            }`}
          >
            aA
          </button>

          {/* Text Color */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowColorPicker(!showColorPicker)
              }}
              className="p-2 border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div
                className="w-4 h-4 rounded"
                style={{
                  background: `conic-gradient(
                #ff0000 0deg 60deg,
                #ffff00 60deg 120deg,
                #00ff00 120deg 180deg,
                #00ffff 180deg 240deg,
                #0000ff 240deg 300deg,
                #ff00ff 300deg 360deg
              )`,
                }}
              />
            </button>

            <CustomColorPicker
              color={currentSettings.color}
              onChange={handleColorChange}
              showPicker={showColorPicker}
              onToggle={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowColorPicker(!showColorPicker)
              }}
              position="right"
            />
          </div>

          {/* Text Alignment */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleAlignChange("left")
            }}
            className={`p-2 border-gray-300 rounded-md transition-colors ${
              currentSettings.align === "left" ? "bg-blue-100 border-blue-300" : "hover:bg-gray-100"
            }`}
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleAlignChange("center")
            }}
            className={`p-2 border-gray-300 rounded-md transition-colors ${
              currentSettings.align === "center" ? "bg-blue-100 border-blue-300" : "hover:bg-gray-100"
            }`}
          >
            <AlignCenter className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleAlignChange("right")
            }}
            className={`p-2 border-gray-300 rounded-md transition-colors ${
              currentSettings.align === "right" ? "bg-blue-100 border-blue-300" : "hover:bg-gray-100"
            }`}
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <style jsx>{`
        /* Hide number input arrows */
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }

        /* Custom styling for range input */
        .range-slider {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          background: #e0e0e0;
          border-radius: 5px;
          outline: none;
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .range-slider:hover {
          opacity: 1;
        }

        .range-slider::-webkit-slider-runnable-track {
          width: 100%;
          height: 8px;
          background: linear-gradient(to right, #8b5cf6 var(--track-fill-percentage, 0%), #e0e0e0 var(--track-fill-percentage, 0%));
          border-radius: 5px;
        }

        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          border: 2px solid #8b5cf6;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          margin-top: -4px;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
        }

        .range-slider::-moz-range-track {
          width: 100%;
          height: 8px;
          background: linear-gradient(to right, #8b5cf6 var(--track-fill-percentage, 0%), #e0e0e0 var(--track-fill-percentage, 0%));
          border-radius: 5px;
        }

        .range-slider::-moz-range-thumb {
          border: 2px solid #8b5cf6;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
        }

        .range-slider {
          --track-fill-percentage: calc(
            ((var(--value) - var(--min)) / (var(--max) - var(--min))) * 100%
          );
        }
      `}</style>
    </div>
  )
}

export default TextToolbar
