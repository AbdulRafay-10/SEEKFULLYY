"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useLocation } from "react-router-dom"
import CustomColorPicker from "../components/WhiteBoard/CustomColorPicker"
import HighlightColorPicker from "../components/WhiteBoard/HighlightColorPicker"
import Canvas from "../components/WhiteBoard/Canvas"
import TextToolbar from "../components/WhiteBoard/TextToolBar"
import TextSubSidebar from "../components/WhiteBoard/TextSubSidebar"
import measureWrappedText from "../utils/MeasureWrappedText"
import CanvasTextInput from "../components/WhiteBoard/CanvasTextInput"

// Icon imports
import SquareIcon from "../assets/icons/Square.png"
import CircleIcon from "../assets/icons/Circle.png"
import TextIcon from "../assets/icons/Text.png"
import BrushIcon from "../assets/icons/Pen.png"
import LineIcon from "../assets/icons/Line.png"
import ImageIcon from "../assets/icons/Gallery.png"
import ShapesIcon from "../assets/icons/Square.png"

// Lucide React icons
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MousePointer,
  Undo,
  Redo,
  ChevronLeft,
  ChevronRight,
  AlignEndVerticalIcon,
  Highlighter,
} from "lucide-react"

const SmallColorWheelIcon = ({ onClick, show }) => {
  if (!show) return null

  return (
    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20 animate-fadeIn">
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        className="w-14 h-14 rounded-full hover:scale-110 transition-all duration-200 shadow-xl border-2 border-white"
        style={{
          background: `conic-gradient(
          #ff0000 0deg,
          #ff8000 45deg,
          #ffff00 90deg,
          #80ff00 135deg,
          #00ff00 180deg,
          #00ff80 225deg,
          #00ffff 270deg,
          #0080ff 315deg,
          #0000ff 360deg,
          #8000ff 450deg,
          #ff00ff 495deg,
          #ff0080 540deg,
          #ff0000 585deg
        )`,
        }}
      />
    </div>
  )
}

const WhiteBoard = () => {
  const location = useLocation()
  const [canvasSize, setCanvasSize] = useState(location.state?.canvasSize || { width: 1200, height: 800 })

  useEffect(() => {
    if (location.state?.canvasSize) {
      setCanvasSize(location.state.canvasSize)
    }
  }, [location.state])

  const primaryColor = "#6B7280"
  const [isTransforming, setIsTransforming] = useState(false)
  const primaryColorLight = "#9CA3AF"
  const [selectedCanvasIdx, setSelectedCanvasIdx] = useState(0)
  const canvasContainerRef = useRef(null)
  const textToolbarRef = useRef(null)
  const canvasTextInputRef = useRef(null)
  const mainContentAreaRef = useRef(null) // NEW: Ref for the main content area
  const [elements, setElements] = useState([])

  const [pages, setPages] = useState([
    {
      id: "1",
      name: "Page 1",
      elements: [],
      backgroundColor: "linear-gradient(to bottom right, #ff0000, #0000ff)",
      isHidden: false,
      isLocked: false,
    },
  ])
  const [history, setHistory] = useState([JSON.parse(JSON.stringify(pages))]) // History stores deep copies of the entire pages array
  const [historyIndex, setHistoryIndex] = useState(0)
  const [activeTool, setActiveTool] = useState("select")

  const [currentPage, setCurrentPage] = useState(0)
  const [isNotesOpen, setIsNotesOpen] = useState(false)
  const [colorWheelCanvasIdx, setColorWheelCanvasIdx] = useState(null)
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false)
  const [showStrokePicker, setShowStrokePicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false) // New state for highlight picker
  const [showColorIcon, setShowColorIcon] = useState(false)
  const [colorIconTimeout, setColorIconTimeout] = useState(null)
  const [savedColors, setSavedColors] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])

  const [textSettings, setTextSettings] = useState({
    fontFamily: "Arial",
    fontSize: 16,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    uppercase: false,
    color: "#000000",
    align: "left",
    bulletList: false,
    numberedList: false,
    lineHeight: 1.2,
    letterSpacing: 0,
  })

  const [squareSettings, setSquareSettings] = useState({
    corners: 4,
    cornerRadius: 0,
    strokeWidth: 2,
    opacity: 100,
    fillColor: "rgba(0,0,0,0)",
    strokeColor: "#000000",
  })

  const [highlightSettings, setHighlightSettings] = useState({
    // New state for highlight properties
    fillColor: "#FFFF00", // Default yellow
    opacity: 50, // Default 50% opacity
  })

  const [showTextSubSidebar, setShowTextSubSidebar] = useState(false)
  const [showRectangleSidebar, setShowRectangleSidebar] = useState(false)
  const [showCircleSidebar, setShowCircleSidebar] = useState(false)
  const [showLineSidebar, setShowLineSidebar] = useState(false)
  const [showPenSidebar, setShowPenSidebar] = useState(false)
  const [editingTextElementId, setEditingTextElementId] = useState(null)
  const [selectedElement, setSelectedElement] = useState(null)
  const [selectedTextElement, setSelectedTextElement] = useState(null)
  const colorPickerJustOpenedRef = useRef(false)

  // NEW: State to store screen coordinates for CanvasTextInput
  const [editingTextScreenCoords, setEditingTextScreenCoords] = useState(null)

  // Sidebar states
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [shapesSidebarOpen, setShapesSidebarOpen] = useState(false)

  // Main tools for the sidebar
  const mainTools = [
    { id: "select", icon: MousePointer, label: "SELECT", isLucideIcon: true },
    { id: "text", icon: TextIcon, label: "TEXT", isLucideIcon: false },
    { id: "shapes", icon: ShapesIcon, label: "SHAPES", isLucideIcon: false, isMenu: true },
    { id: "image", icon: ImageIcon, label: "IMAGE", isLucideIcon: false },
    { id: "highlight", icon: Highlighter, label: "HIGHLIGHT", isLucideIcon: true }, // New highlight tool
  ]

  // Tools for the shapes sub-menu
  const shapeTools = [
    {
      id: "rectangle",
      icon: SquareIcon,
      label: "SQUARE",
      isLucideIcon: false,
      onClick: () => handleToolClick("rectangle"),
    },
    {
      id: "circle",
      icon: CircleIcon,
      label: "CIRCLE",
      isLucideIcon: false,
      onClick: () => handleToolClick("circle"),
    },
    {
      id: "line",
      icon: LineIcon,
      label: "LINE",
      isLucideIcon: false,
      onClick: () => handleToolClick("line"),
    },
    {
      id: "pen",
      icon: BrushIcon,
      label: "PEN",
      isLucideIcon: false,
      onClick: () => handleToolClick("pen"),
    },
  ]

  const addHistorySnapshot = useCallback(
    (currentPagesState) => {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(JSON.parse(JSON.stringify(currentPagesState))) // Deep copy
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [history, historyIndex],
  )

  const RectangleSidebar = ({ selectedElement }) => {
    const currentCorners = selectedElement?.corners ?? squareSettings.corners
    const currentCornerRadius = selectedElement?.cornerRadius ?? squareSettings.cornerRadius
    const currentStrokeWidth = selectedElement?.strokeWidth ?? squareSettings.strokeWidth
    const currentOpacity = selectedElement?.opacity ?? squareSettings.opacity
    const currentFillColor = selectedElement?.fillColor ?? squareSettings.fillColor
    const currentStrokeColor = selectedElement?.strokeColor ?? squareSettings.strokeColor

    const handleSettingChange = useCallback(
      (key, value) => {
        if (selectedElement && selectedElement.type === "rectangle") {
          const updatedElement = { ...selectedElement, [key]: value }

          const updatedElements = pages[selectedCanvasIdx].elements.map((el) =>
            el.id === selectedElement.id ? updatedElement : el,
          )

          const updatedPages = pages.map((p, i) => (i === selectedCanvasIdx ? { ...p, elements: updatedElements } : p))

          setPages(updatedPages)
          setSelectedElement(updatedElement)
          addHistorySnapshot(updatedPages) // Add to history for discrete change
        } else {
          setSquareSettings((prev) => ({ ...prev, [key]: value }))
        }
      },
      [selectedElement, selectedCanvasIdx, pages, addHistorySnapshot],
    )

    return (
      <div className="fixed right-0 top-0 h-screen w-64 bg-white shadow-lg z-[9998] overflow-y-auto border-l border-gray-200 p-4 rectangle-sidebar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Rectangle Settings</h3>
          <button onClick={() => setShowRectangleSidebar(false)} className="p-1 rounded-full hover:bg-gray-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2">Shape Type</h4>
          <div className="grid grid-cols-2 gap-2">
            {[4, 6, 8, 12].map((corners) => (
              <button
                key={corners}
                onClick={() => handleSettingChange("corners", corners)}
                className={`p-2 border rounded-md flex items-center justify-center ${
                  currentCorners === corners ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <polygon points={generatePolygonPoints(corners, 12)} fill="currentColor" stroke="currentColor" />
                  </svg>
                </div>
                <span className="ml-2 text-xs">{corners} Corners</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium mb-2">
            <span>Corner Radius</span>
            <span>{currentCornerRadius}px</span>
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={currentCornerRadius}
            onChange={(e) => handleSettingChange("cornerRadius", Number.parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium mb-2">
            <span>Stroke Width</span>
            <span>{currentStrokeWidth}px</span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={currentStrokeWidth}
            onChange={(e) => handleSettingChange("strokeWidth", Number.parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium mb-2">
            <span>Opacity</span>
            <span>{currentOpacity}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={currentOpacity}
            onChange={(e) => handleSettingChange("opacity", Number.parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fill Color</label>
            <input
              type="color"
              value={currentFillColor}
              onChange={(e) => handleSettingChange("fillColor", e.target.value)}
              className="w-full h-8 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stroke Color</label>
            <input
              type="color"
              value={currentStrokeColor}
              onChange={(e) => handleSettingChange("strokeColor", e.target.value)}
              className="w-full h-8 cursor-pointer"
            />
          </div>
        </div>
      </div>
    )
  }

  const CircleSidebar = ({ selectedElement }) => {
    const currentStrokeWidth = selectedElement?.strokeWidth ?? squareSettings.strokeWidth
    const currentOpacity = selectedElement?.opacity ?? squareSettings.opacity
    const currentFillColor = selectedElement?.fillColor ?? squareSettings.fillColor
    const currentStrokeColor = selectedElement?.strokeColor ?? squareSettings.strokeColor

    const handleSettingChange = useCallback(
      (key, value) => {
        if (selectedElement && selectedElement.type === "circle") {
          const updatedElement = { ...selectedElement, [key]: value }

          const updatedElements = pages[selectedCanvasIdx].elements.map((el) =>
            el.id === selectedElement.id ? updatedElement : el,
          )

          const updatedPages = pages.map((p, i) => (i === selectedCanvasIdx ? { ...p, elements: updatedElements } : p))

          setPages(updatedPages)
          setSelectedElement(updatedElement)
          addHistorySnapshot(updatedPages) // Add to history for discrete change
        } else {
          setSquareSettings((prev) => ({ ...prev, [key]: value }))
        }
      },
      [selectedElement, selectedCanvasIdx, pages, addHistorySnapshot],
    )

    return (
      <div className="fixed right-0 top-0 h-screen w-64 bg-white shadow-lg z-[9998] overflow-y-auto border-l border-gray-200 p-4 circle-sidebar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Circle Settings</h3>
          <button onClick={() => setShowCircleSidebar(false)} className="p-1 rounded-full hover:bg-gray-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium mb-2">
            <span>Stroke Width</span>
            <span>{currentStrokeWidth}px</span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={currentStrokeWidth}
            onChange={(e) => handleSettingChange("strokeWidth", Number.parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium mb-2">
            <span>Opacity</span>
            <span>{currentOpacity}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={currentOpacity}
            onChange={(e) => handleSettingChange("opacity", Number.parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fill Color</label>
            <input
              type="color"
              value={currentFillColor}
              onChange={(e) => handleSettingChange("fillColor", e.target.value)}
              className="w-full h-8 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stroke Color</label>
            <input
              type="color"
              value={currentStrokeColor}
              onChange={(e) => handleSettingChange("strokeColor", e.target.value)}
              className="w-full h-8 cursor-pointer"
            />
          </div>
        </div>
      </div>
    )
  }

  const LineSidebar = ({ selectedElement }) => {
    const currentStrokeWidth = selectedElement?.strokeWidth ?? squareSettings.strokeWidth
    const currentOpacity = selectedElement?.opacity ?? squareSettings.opacity
    const currentStrokeColor = selectedElement?.strokeColor ?? squareSettings.strokeColor

    const handleSettingChange = useCallback(
      (key, value) => {
        if (selectedElement && selectedElement.type === "line") {
          const updatedElement = { ...selectedElement, [key]: value }

          const updatedElements = pages[selectedCanvasIdx].elements.map((el) =>
            el.id === selectedElement.id ? updatedElement : el,
          )

          const updatedPages = pages.map((p, i) => (i === selectedCanvasIdx ? { ...p, elements: updatedElements } : p))

          setPages(updatedPages)
          setSelectedElement(updatedElement)
          addHistorySnapshot(updatedPages) // Add to history for discrete change
        } else {
          setSquareSettings((prev) => ({ ...prev, [key]: value }))
        }
      },
      [selectedElement, selectedCanvasIdx, pages, addHistorySnapshot],
    )

    return (
      <div className="fixed right-0 top-0 h-screen w-64 bg-white shadow-lg z-[9998] overflow-y-auto border-l border-gray-200 p-4 line-sidebar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Line Settings</h3>
          <button onClick={() => setShowLineSidebar(false)} className="p-1 rounded-full hover:bg-gray-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium mb-2">
            <span>Stroke Width</span>
            <span>{currentStrokeWidth}px</span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={currentStrokeWidth}
            onChange={(e) => handleSettingChange("strokeWidth", Number.parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium mb-2">
            <span>Opacity</span>
            <span>{currentOpacity}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={currentOpacity}
            onChange={(e) => handleSettingChange("opacity", Number.parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stroke Color</label>
          <input
            type="color"
            value={currentStrokeColor}
            onChange={(e) => handleSettingChange("strokeColor", e.target.value)}
            className="w-full h-8 cursor-pointer"
          />
        </div>
      </div>
    )
  }

  const PenSidebar = ({ selectedElement }) => {
    const currentStrokeWidth = selectedElement?.strokeWidth ?? squareSettings.strokeWidth
    const currentOpacity = selectedElement?.opacity ?? squareSettings.opacity
    const currentStrokeColor = selectedElement?.strokeColor ?? squareSettings.strokeColor

    const handleSettingChange = useCallback(
      (key, value) => {
        if (selectedElement && selectedElement.type === "pen") {
          const updatedElement = { ...selectedElement, [key]: value }

          const updatedElements = pages[selectedCanvasIdx].elements.map((el) =>
            el.id === selectedElement.id ? updatedElement : el,
          )

          const updatedPages = pages.map((p, i) => (i === selectedCanvasIdx ? { ...p, elements: updatedElements } : p))

          setPages(updatedPages)
          setSelectedElement(updatedElement)
          addHistorySnapshot(updatedPages) // Add to history for discrete change
        } else {
          setSquareSettings((prev) => ({ ...prev, [key]: value }))
        }
      },
      [selectedElement, selectedCanvasIdx, pages, addHistorySnapshot],
    )

    return (
      <div className="fixed right-0 top-0 h-screen w-64 bg-white shadow-lg z-[9998] overflow-y-auto border-l border-gray-200 p-4 pen-sidebar">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Pen Settings</h3>
          <button onClick={() => setShowPenSidebar(false)} className="p-1 rounded-full hover:bg-gray-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium mb-2">
            <span>Stroke Width</span>
            <span>{currentStrokeWidth}px</span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={currentStrokeWidth}
            onChange={(e) => handleSettingChange("strokeWidth", Number.parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="mb-4">
          <label className="flex justify-between text-sm font-medium mb-2">
            <span>Opacity</span>
            <span>{currentOpacity}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={currentOpacity}
            onChange={(e) => handleSettingChange("opacity", Number.parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stroke Color</label>
          <input
            type="color"
            value={currentStrokeColor}
            onChange={(e) => handleSettingChange("strokeColor", e.target.value)}
            className="w-full h-8 cursor-pointer"
          />
        </div>
      </div>
    )
  }

  const generatePolygonPoints = (sides, radius) => {
    const points = []
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
      const x = 12 + radius * Math.cos(angle)
      const y = 12 + radius * Math.sin(angle)
      points.push(`${x},${y}`)
    }
    return points.join(" ")
  }

  const handleColorSelect = (color) => {
    const updatedPages = pages.map((p, i) => (i === selectedCanvasIdx ? { ...p, backgroundColor: color } : p))
    setPages(updatedPages)
    addHistorySnapshot(updatedPages) // Add to history
  }

  const addPage = () => {
    const newPage = {
      id: Date.now().toString(),
      name: `Page ${pages.length + 1}`,
      elements: [],
      backgroundColor: "#ffffff",
      isHidden: false,
      isLocked: false,
    }

    const updatedPages = [...pages, newPage]
    setPages(updatedPages)
    setCurrentPage(pages.length)
    setSelectedCanvasIdx(pages.length)
    addHistorySnapshot(updatedPages) // Add to history
    setElements([]) // Clear elements for new page
  }

  const handleElementsUpdateFromCanvas = useCallback(
    (newElements, isContinuousOperation = false) => {
      // Update the current state immediately
      const updatedPages = pages.map((p, i) => (i === selectedCanvasIdx ? { ...p, elements: newElements } : p))
      setPages(updatedPages)
      setElements(newElements) // Keep local elements state in sync

      // Update selected element reference if it exists
      if (selectedElement) {
        const updatedSelected = newElements.find((el) => el.id === selectedElement.id)
        setSelectedElement(updatedSelected || null)
      }

      // Only add to history if it's a discrete operation
      if (!isContinuousOperation) {
        addHistorySnapshot(updatedPages)
      }
    },
    [pages, selectedCanvasIdx, selectedElement, addHistorySnapshot],
  )

  const handleTransformationStart = useCallback(() => {
    // This is called when dragging/resizing starts.
    // The initial state is already saved by the first discrete action or the previous transformation end.
    // We just need to mark that a continuous operation is in progress.
    setIsTransforming(true)
  }, [])

  const handleTransformationEnd = useCallback(() => {
    // This is called when dragging/resizing ends.
    // We save the final state of the continuous operation.
    if (isTransforming) {
      addHistorySnapshot(pages) // Save the current state as the final state
      setIsTransforming(false)
    }
  }, [isTransforming, pages, addHistorySnapshot])

  const handleUndo = () => {
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    const pagesToRestore = history[newIndex]
    setHistoryIndex(newIndex)
    setPages(JSON.parse(JSON.stringify(pagesToRestore))) // Deep copy to restore
    setElements(pagesToRestore[selectedCanvasIdx]?.elements || []) // Update local elements state
    setSelectedElement(null)
    setSelectedTextElement(null)
    setEditingTextElementId(null)
    setEditingTextScreenCoords(null) // Clear coords on undo
  }

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return
    const newIndex = historyIndex + 1
    const pagesToRestore = history[newIndex]
    setHistoryIndex(newIndex)
    setPages(JSON.parse(JSON.stringify(pagesToRestore))) // Deep copy to restore
    setElements(pagesToRestore[selectedCanvasIdx]?.elements || []) // Update local elements state
    setSelectedElement(null)
    setSelectedTextElement(null)
    setEditingTextElementId(null)
    setEditingTextScreenCoords(null) // Clear coords on redo
  }

  const handleSaveColor = (color) => {
    if (!savedColors.includes(color)) {
      setSavedColors([...savedColors, color])
    }
  }

  const handleDeletePage = (idx) => {
    if (pages.length <= 1) return
    const newPages = pages.filter((_, i) => i !== idx)
    let newSelectedIdx = selectedCanvasIdx
    if (idx === selectedCanvasIdx) {
      newSelectedIdx = Math.max(0, Math.min(selectedCanvasIdx, newPages.length - 1))
    } else if (idx < selectedCanvasIdx) {
      newSelectedIdx = selectedCanvasIdx - 1
    }
    setPages(newPages)
    setSelectedCanvasIdx(newSelectedIdx)
    setCurrentPage(newSelectedIdx)
    setElements(newPages[newSelectedIdx]?.elements || [])
    setSelectedElement(null)
    setSelectedTextElement(null)
    setEditingTextElementId(null)
    setEditingTextScreenCoords(null) // Clear coords on delete
    addHistorySnapshot(newPages) // Add to history
  }

  const handleHidePage = () => {
    const updatedPages = [...pages]
    updatedPages[currentPage] = {
      ...updatedPages[currentPage],
      isHidden: !updatedPages[currentPage].isHidden,
    }
    setPages(updatedPages)
    addHistorySnapshot(updatedPages) // Add to history
  }

  const handleLockPage = () => {
    const updatedPages = [...pages]
    updatedPages[currentPage] = {
      ...updatedPages[currentPage],
      isLocked: !updatedPages[currentPage].isLocked,
    }
    setPages(updatedPages)
    setSelectedElement(null)
    setSelectedTextElement(null)
    setEditingTextElementId(null)
    setEditingTextScreenCoords(null) // Clear coords on lock
    addHistorySnapshot(updatedPages) // Add to history
  }

  const getCurrentPageData = () => {
    return (
      pages[selectedCanvasIdx] ||
      pages[0] || {
        id: "default",
        name: "Page 1",
        elements: [],
        isHidden: false,
        isLocked: false,
      }
    )
  }

  const handleCanvasClick = useCallback(
    (e, idx) => {
      e.stopPropagation()

      if (activeTool === "select" && !pages[idx]?.isLocked) {
        if (colorIconTimeout) {
          clearTimeout(colorIconTimeout)
        }

        setSelectedCanvasIdx(idx)
        setColorWheelCanvasIdx(idx)
        setShowColorIcon(true)

        const newTimeout = setTimeout(() => {
          setShowColorIcon(false)
          setColorWheelCanvasIdx(null)
        }, 8000)

        setColorIconTimeout(newTimeout)
      }
    },
    [activeTool, pages, colorIconTimeout],
  )

  const handleColorIconClick = useCallback(
    (idx) => {
      if (colorIconTimeout) {
        clearTimeout(colorIconTimeout)
        setColorIconTimeout(null)
      }
      setColorWheelCanvasIdx(idx)
      setShowBackgroundPicker(true)
      colorPickerJustOpenedRef.current = true
    },
    [colorIconTimeout],
  )

  const handleColorPickerToggle = useCallback(
    (shouldShow) => {
      const newState = shouldShow !== undefined ? shouldShow : !showBackgroundPicker
      setShowBackgroundPicker(newState)

      if (!newState) {
        setShowColorIcon(false)
        setColorWheelCanvasIdx(null)
        if (colorIconTimeout) {
          clearTimeout(colorIconTimeout)
          setColorIconTimeout(null)
        }
      }
    },
    [showBackgroundPicker, colorIconTimeout],
  )

  const handleTextSettingsChange = useCallback(
    (newSettings) => {
      setTextSettings(newSettings)
      if (selectedTextElement) {
        handleApplyStyleToSelectedText(newSettings)
      }
    },
    [selectedTextElement],
  )

  // Add this callback function
  const handleSelectedTextElementChange = useCallback((updatedElement) => {
    setSelectedTextElement(updatedElement)
  }, [])

  // FIXED: Simplified text creation function
  const addPredefinedText = useCallback(
    (type) => {
      if (pages[selectedCanvasIdx]?.isLocked) return

      // Close sidebar immediately
      setShowTextSubSidebar(false)
      setSidebarOpen(false)

      // Calculate center position in canvas coordinates
      const centerX = canvasSize.width / 2
      const centerY = canvasSize.height / 2
      const defaultWidth = 300

      let initialText = "Click to type"
      let newTextSettings = { ...textSettings }

      switch (type) {
        case "heading":
          initialText = "Add a Heading"
          newTextSettings = {
            ...textSettings,
            fontSize: 48,
            bold: true,
            align: "center",
          }
          break
        case "subheading":
          initialText = "Add a Subheading"
          newTextSettings = {
            ...textSettings,
            fontSize: 24,
            bold: true,
            align: "center",
          }
          break
        case "body":
          initialText = "Add a little bit of body text"
          newTextSettings = { ...textSettings, fontSize: 16, align: "left" }
          break
        default:
          initialText = "Add Text"
          newTextSettings = { ...textSettings, fontSize: 24, align: "center" }
          break
      }

      // Create new text element with unique ID
      const newElementId = Date.now() + Math.random() // More unique ID
      const newElement = {
        id: newElementId,
        type: "text",
        text: initialText,
        x: centerX - defaultWidth / 2,
        y: centerY - 20,
        width: defaultWidth,
        height: 40,
        canvasIndex: selectedCanvasIdx, // Track which canvas this belongs to
        ...newTextSettings,
      }

      // Update text settings state
      setTextSettings(newTextSettings)

      // Add element to the CORRECT page
      const updatedElements = [...pages[selectedCanvasIdx].elements, newElement]
      const updatedPages = pages.map((p, i) => (i === selectedCanvasIdx ? { ...p, elements: updatedElements } : p))
      setPages(updatedPages)
      addHistorySnapshot(updatedPages) // Add to history for discrete change

      // Set selection and editing states
      setSelectedElement(newElement)
      setSelectedTextElement(newElement)
      setActiveTool("select")

      // Directly set editingTextElementId. The useEffect below will handle coords.
      setEditingTextElementId(newElementId)
    },
    [pages, selectedCanvasIdx, textSettings, canvasSize, addHistorySnapshot],
  )

  const handleApplyStyleToSelectedText = useCallback(
    (styleUpdates) => {
      if (!selectedTextElement) {
        return
      }

      // FIXED: Always preserve current fontSize unless explicitly updating it
      const updatedElement = {
        ...selectedTextElement,
        ...styleUpdates,
        // Preserve fontSize if not explicitly being updated
        fontSize: styleUpdates.fontSize !== undefined ? styleUpdates.fontSize : selectedTextElement.fontSize,
      }

      // Re-measure height based on new styles and current width
      const tempCanvas = document.createElement("canvas")
      const tempCtx = tempCanvas.getContext("2d")
      const { height: measuredHeight } = measureWrappedText(
        tempCtx,
        updatedElement.text || "",
        updatedElement.width,
        updatedElement.fontSize, // Use the preserved/updated fontSize
        updatedElement.fontFamily,
        updatedElement.bold,
        updatedElement.italic,
        updatedElement.uppercase,
        updatedElement.letterSpacing,
      )
      updatedElement.height = measuredHeight

      const updatedElements = pages[selectedCanvasIdx].elements.map((el) =>
        el.id === updatedElement.id ? updatedElement : el,
      )
      const updatedPages = pages.map((p, i) => (i === selectedCanvasIdx ? { ...p, elements: updatedElements } : p))
      setPages(updatedPages)
      setSelectedElement(updatedElement)
      setSelectedTextElement(updatedElement)
      addHistorySnapshot(updatedPages) // Add to history for discrete change
    },
    [selectedTextElement, pages, selectedCanvasIdx, addHistorySnapshot],
  )

  const handleImageUpload = useCallback(() => {
    if (pages[selectedCanvasIdx]?.isLocked) return

    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const newElement = {
            id: Date.now(),
            type: "image",
            x: canvasSize.width / 2 - 100,
            y: canvasSize.height / 2 - 100,
            width: 200,
            height: 200,
            src: event.target.result,
            strokeColor: squareSettings.strokeColor,
            opacity: squareSettings.opacity,
          }
          const updatedElements = [...pages[selectedCanvasIdx].elements, newElement]
          const updatedPages = pages.map((p, i) => (i === selectedCanvasIdx ? { ...p, elements: updatedElements } : p))
          setPages(updatedPages)
          addHistorySnapshot(updatedPages) // Add to history for discrete change
          setSelectedElement(newElement)
          setActiveTool("select")
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }, [pages, selectedCanvasIdx, canvasSize.width, canvasSize.height, squareSettings, addHistorySnapshot])

  // NEW: Store screen coordinates when text editing starts
  const handleTextEditStarted = useCallback((text, screenWidth, screenHeight, screenX, screenY, isInitialEdit) => {
    if (mainContentAreaRef.current) {
      const parentRect = mainContentAreaRef.current.getBoundingClientRect()
      const relativeX = screenX - parentRect.left
      const relativeY = screenY - parentRect.top
      setEditingTextScreenCoords({ x: relativeX, y: relativeY, width: screenWidth, height: screenHeight })
    } else {
      setEditingTextScreenCoords({ x: screenX, y: screenY, width: screenWidth, height: screenHeight })
    }
  }, [])

  // FIXED: Simplified text edit completion
  const handleTextEditFinished = useCallback(
    (elementId, newText, screenWidth, screenHeight, screenX, screenY, cancelled = false) => {
      const currentElements = pages[selectedCanvasIdx].elements
      const elementIndex = currentElements.findIndex((el) => el.id === elementId)

      if (elementIndex === -1 || pages[selectedCanvasIdx]?.isLocked) {
        setEditingTextElementId(null)
        setEditingTextScreenCoords(null) // Clear coords
        return
      }

      const updatedElement = { ...currentElements[elementIndex] }

      if (cancelled || newText.trim() === "") {
        // Remove empty text elements from the correct canvas
        const filteredElements = currentElements.filter((el) => el.id !== elementId)
        const updatedPages = pages.map((p, i) => (i === selectedCanvasIdx ? { ...p, elements: filteredElements } : p))
        setPages(updatedPages)
        addHistorySnapshot(updatedPages) // Add to history for discrete change
        setSelectedElement(null)
        setSelectedTextElement(null)
        setEditingTextElementId(null)
        setEditingTextScreenCoords(null) // Clear coords
        return
      }

      // Convert screen coordinates to canvas coordinates for the correct canvas
      const canvasElements = canvasContainerRef.current?.querySelectorAll(".canvas-element")
      const canvasElement = canvasElements?.[selectedCanvasIdx]

      if (canvasElement) {
        const canvasRect = canvasElement.getBoundingClientRect()
        const canvasNativeWidth = canvasElement.width // Actual pixel width of the canvas
        const canvasNativeHeight = canvasElement.height // Actual pixel height of the canvas

        // Calculate scale based on rendered size vs native size
        const scaleX = canvasNativeWidth / canvasRect.width
        const scaleY = canvasNativeHeight / canvasRect.height

        // Convert screen coordinates (relative to viewport) to canvas coordinates (relative to canvas's top-left corner in its native pixel space)
        const canvasX = (screenX - canvasRect.left) * scaleX
        const canvasY = (screenY - canvasRect.top) * scaleY
        const canvasWidth = screenWidth * scaleX
        const canvasHeight = screenHeight * scaleY

        updatedElement.text = newText
        // When updating the element, we need to re-measure its actual content width and height
        // to ensure it doesn't wrap unless explicitly resized by the user.
        const tempCanvas = document.createElement("canvas")
        const tempCtx = tempCanvas.getContext("2d")
        tempCtx.font = `${updatedElement.bold ? "bold " : ""}${updatedElement.italic ? "italic " : ""}${updatedElement.fontSize}px ${updatedElement.fontFamily}`
        tempCtx.letterSpacing = `${updatedElement.letterSpacing || textSettings.letterSpacing}px`
        let textToDraw = updatedElement.text || ""
        if (updatedElement.uppercase) textToDraw = textToDraw.toUpperCase()

        const { width: newMeasuredWidth, height: newMeasuredHeight } = measureWrappedText(
          tempCtx,
          textToDraw,
          Number.POSITIVE_INFINITY, // Allow infinite width to get true unwrapped width
          updatedElement.fontSize,
          updatedElement.fontFamily,
          updatedElement.bold,
          updatedElement.italic,
          updatedElement.uppercase,
          updatedElement.letterSpacing,
        )

        updatedElement.x = canvasX
        updatedElement.y = canvasY
        updatedElement.width = newMeasuredWidth // Use the newly measured width
        updatedElement.height = newMeasuredHeight // Use the newly measured height
        updatedElement.canvasIndex = selectedCanvasIdx // Ensure canvas association
      }

      const updatedElements = currentElements.map((el) => (el.id === updatedElement.id ? updatedElement : el))
      const updatedPages = pages.map((p, i) => (i === selectedCanvasIdx ? { ...p, elements: updatedElements } : p))

      setPages(updatedPages)
      addHistorySnapshot(updatedPages) // Add to history for discrete change
      // FIXED: Clear editing state but keep element selected for toolbar
      setEditingTextElementId(null)
      setEditingTextScreenCoords(null) // Clear coords
      setSelectedElement(updatedElement)
      setSelectedTextElement(updatedElement)
    },
    [pages, selectedCanvasIdx, addHistorySnapshot],
  )

  // NEW: Handle single click on text elements to show toolbar
  const handleTextElementClick = useCallback(
    (element, canvasIdx) => {
      if (canvasIdx === selectedCanvasIdx && element.type === "text") {
        setSelectedElement(element)
        setSelectedTextElement(element)
        setActiveTool("select") // Ensure we're in select mode to show toolbar
      }
    },
    [selectedCanvasIdx],
  )

  // FIXED: Simplified text addition by click
  const handleAddTextAtClick = useCallback(
    (x, y) => {
      if (pages[selectedCanvasIdx]?.isLocked) {
        return
      }

      const newTextElement = {
        id: Date.now() + Math.random(), // More unique ID
        type: "text",
        text: "Click to type",
        x: x - 100,
        y: y - 20,
        width: 200,
        height: 40,
        canvasIndex: selectedCanvasIdx, // Track which canvas this belongs to
        ...textSettings,
      }

      const updatedElements = [...pages[selectedCanvasIdx].elements, newTextElement]
      const updatedPages = pages.map((p, i) => (i === selectedCanvasIdx ? { ...p, elements: updatedElements } : p))
      setPages(updatedPages)
      addHistorySnapshot(updatedPages) // Add to history for discrete change
      setSelectedElement(newTextElement)
      setSelectedTextElement(newTextElement)

      // Directly set editingTextElementId. The useEffect below will handle coords.
      setEditingTextElementId(newTextElement.id)
    },
    [pages, selectedCanvasIdx, textSettings, addHistorySnapshot],
  )

  const currentPageData = pages[selectedCanvasIdx] || pages[0] || {}

  // NEW useEffect to handle initial text editing for newly added elements
  useEffect(() => {
    if (editingTextElementId && selectedTextElement) {
      // Ensure the canvas element is rendered before trying to get its position
      const canvasElement = canvasContainerRef.current?.querySelectorAll(".canvas-element")[selectedCanvasIdx]
      if (canvasElement) {
        // Use requestAnimationFrame to ensure the browser has rendered the new element
        requestAnimationFrame(() => {
          const canvasRect = canvasElement.getBoundingClientRect()

          // Calculate the actual rendered bounding box of the text element in canvas coordinates
          const tempCanvas = document.createElement("canvas")
          const tempCtx = tempCanvas.getContext("2d")
          tempCtx.font = `${selectedTextElement.bold ? "bold " : ""}${selectedTextElement.italic ? "italic " : ""}${selectedTextElement.fontSize}px ${selectedTextElement.fontFamily}`
          let textToDraw = selectedTextElement.text || ""
          if (selectedTextElement.uppercase) textToDraw = textToDraw.toUpperCase()

          const unwrappedTextMetrics = tempCtx.measureText(textToDraw)
          const unwrappedTextWidth = unwrappedTextMetrics.width

          // Calculate single line height based on font size and line height
          const singleLineHeight =
            (selectedTextElement.fontSize || textSettings.fontSize) *
            (selectedTextElement.lineHeight || textSettings.lineHeight || 1.2)

          let boxX_canvas = selectedTextElement.x
          if (selectedTextElement.align === "center") {
            boxX_canvas = selectedTextElement.x + (selectedTextElement.width - unwrappedTextWidth) / 2
          } else if (selectedTextElement.align === "right") {
            boxX_canvas = selectedTextElement.x + (selectedTextElement.width - unwrappedTextWidth)
          }
          const boxY_canvas = selectedTextElement.y
          const PADDING_BUFFER = 40 // Consistent increased buffer
          const boxWidth_canvas = unwrappedTextWidth + PADDING_BUFFER
          const boxHeight_canvas = singleLineHeight // Use single line height

          // Convert canvas bounding box to viewport screen coordinates
          const screenX_viewport = boxX_canvas * (canvasRect.width / canvasElement.width) + canvasRect.left
          const screenY_viewport = boxY_canvas * (canvasRect.height / canvasElement.height) + canvasRect.top
          const screenWidth_viewport = boxWidth_canvas * (canvasRect.width / canvasElement.width)
          const screenHeight_viewport = boxHeight_canvas * (canvasRect.height / canvasElement.height)

          // Call handleTextEditStarted to set the screen coordinates for CanvasTextInput
          handleTextEditStarted(
            selectedTextElement.text,
            screenWidth_viewport,
            screenHeight_viewport,
            screenX_viewport,
            screenY_viewport,
            true, // isInitialEdit
          )
        })
      }
    }
  }, [editingTextElementId, selectedTextElement, selectedCanvasIdx, handleTextEditStarted, canvasContainerRef])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerJustOpenedRef.current) {
        colorPickerJustOpenedRef.current = false
        return
      }

      const clickedOnTextToolbar = textToolbarRef.current && textToolbarRef.current.contains(event.target)
      const clickedOnCanvasTextInput = event.target.closest(".canvas-text-input")
      const clickedOnCanvasElement = event.target.closest(".canvas-element")

      if (editingTextElementId) {
        if (!clickedOnCanvasTextInput && !clickedOnTextToolbar) {
          // Removed setTimeout here, relying on requestAnimationFrame in CanvasTextInput
          if (canvasTextInputRef.current?.blur) {
            canvasTextInputRef.current.blur()
          }
          return // Exit early if editing text and clicked outside text input/toolbar
        }
      }

      const clickedOnColorPicker = event.target.closest(".color-picker-sidebar")
      const clickedOnSmallColorWheelIcon = event.target.closest(".small-color-wheel-icon-container")
      const clickedOnRectangleSidebar = event.target.closest(".rectangle-sidebar")
      const clickedOnCircleSidebar = event.target.closest(".circle-sidebar")
      const clickedOnLineSidebar = event.target.closest(".line-sidebar")
      const clickedOnPenSidebar = event.target.closest(".pen-sidebar")
      const clickedOnSquareSidebar = event.target.closest(".square-sidebar")
      const clickedOnMainSidebar = event.target.closest(".main-sidebar")
      const clickedOnShapesSidebar = event.target.closest(".shapes-sidebar")
      const clickedOnToolsButton = event.target.closest(".tools-button")
      const clickedOnNotesButton = event.target.closest(".notes-toggle-button")
      const clickedOnTextSubSidebar = event.target.closest(".text-sub-sidebar") // Corrected class name
      const clickedOnHighlightPicker = event.target.closest(".highlight-color-picker-sidebar") // New: Highlight picker

      const clickedOnAnyInteractiveUI =
        clickedOnTextToolbar ||
        clickedOnColorPicker ||
        clickedOnSmallColorWheelIcon ||
        clickedOnRectangleSidebar ||
        clickedOnCircleSidebar ||
        clickedOnLineSidebar ||
        clickedOnPenSidebar ||
        clickedOnMainSidebar ||
        clickedOnShapesSidebar ||
        clickedOnToolsButton ||
        clickedOnNotesButton ||
        clickedOnCanvasTextInput ||
        clickedOnTextSubSidebar ||
        clickedOnHighlightPicker // New: Highlight picker

      if (!clickedOnAnyInteractiveUI && !clickedOnCanvasElement) {
        setShowColorIcon(false)
        setColorWheelCanvasIdx(null)
        if (colorIconTimeout) {
          clearTimeout(colorIconTimeout)
        }
        setShowBackgroundPicker(false)
        setShowStrokePicker(false)
        setShowHighlightPicker(false) // New: Close highlight picker
        setSelectedElement(null)
        setSelectedTextElement(null)
        setSidebarOpen(false)
        setShapesSidebarOpen(false)
        setShowTextSubSidebar(false)
        setShowRectangleSidebar(false)
        setShowCircleSidebar(false)
        setShowLineSidebar(false)
        setShowPenSidebar(false)
        setIsNotesOpen(false)
      } else if (clickedOnCanvasElement && !selectedElement) {
        setEditingTextElementId(null)
        setEditingTextScreenCoords(null) // Clear coords
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [
    colorIconTimeout,
    editingTextElementId,
    textToolbarRef,
    isNotesOpen,
    showRectangleSidebar,
    showCircleSidebar,
    showLineSidebar,
    showPenSidebar,
    showTextSubSidebar,
    shapesSidebarOpen,
    sidebarOpen,
    showBackgroundPicker,
    showStrokePicker,
    showHighlightPicker, // New: Highlight picker
    selectedElement,
    canvasTextInputRef,
    colorPickerJustOpenedRef,
  ])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (editingTextElementId) {
        return
      }

      if (selectedElement && (e.key === "Backspace" || e.key === "Delete")) {
        e.preventDefault()
        const updatedElements = pages[selectedCanvasIdx].elements.filter((el) => el.id !== selectedElement.id)
        const updatedPages = pages.map((p, i) => (i === selectedCanvasIdx ? { ...p, elements: updatedElements } : p))
        setPages(updatedPages)
        addHistorySnapshot(updatedPages) // Add to history for discrete change
        setSelectedElement(null)
        setSelectedTextElement(null)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedElement, editingTextElementId, pages, selectedCanvasIdx, addHistorySnapshot])

  const handleToolClick = (toolId) => {
    if (currentPageData.isLocked) {
      return
    }

    if (editingTextElementId) {
      if (canvasTextInputRef.current && typeof canvasTextInputRef.current.blur === "function") {
        canvasTextInputRef.current.blur()
      }
    }

    setShowTextSubSidebar(false)
    setShowRectangleSidebar(false)
    setShowCircleSidebar(false)
    setShowLineSidebar(false)
    setShowPenSidebar(false)
    setShapesSidebarOpen(false)
    setIsNotesOpen(false)
    setShowHighlightPicker(false) // Close highlight picker when other tools are selected

    if (toolId !== "text") {
      setSelectedElement(null)
      setSelectedTextElement(null)
    }

    setActiveTool(toolId)
    switch (toolId) {
      case "shapes":
        setShapesSidebarOpen(true)
        break
      case "text":
        setShowTextSubSidebar(true)
        break
      case "image":
        handleImageUpload()
        setActiveTool("select")
        break
      case "rectangle":
        setShowRectangleSidebar(true)
        break
      case "circle":
        setShowCircleSidebar(true)
        break
      case "line":
        setShowLineSidebar(true)
        break
      case "pen":
        setShowPenSidebar(true)
        break
      case "highlight": // New: Handle highlight tool click
        setShowHighlightPicker(true)
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (selectedElement && selectedElement.type === "rectangle") {
      setShowRectangleSidebar(true)
      setShowCircleSidebar(false)
      setShowLineSidebar(false)
      setShowPenSidebar(false)
    } else if (selectedElement && selectedElement.type === "circle") {
      setShowCircleSidebar(true)
      setShowRectangleSidebar(false)
      setShowLineSidebar(false)
      setShowPenSidebar(false)
    } else if (selectedElement && selectedElement.type === "line") {
      setShowLineSidebar(true)
      setShowRectangleSidebar(false)
      setShowCircleSidebar(false)
      setShowPenSidebar(false)
    } else if (selectedElement && selectedElement.type === "pen") {
      setShowPenSidebar(true)
      setShowRectangleSidebar(false)
      setShowCircleSidebar(false)
      setShowLineSidebar(false)
    } else if (activeTool === "rectangle") {
      setShowRectangleSidebar(true)
      setShowCircleSidebar(false)
      setShowLineSidebar(false)
      setShowPenSidebar(false)
    } else if (activeTool === "circle") {
      setShowCircleSidebar(true)
      setShowRectangleSidebar(false)
      setShowLineSidebar(false)
      setShowPenSidebar(false)
    } else if (activeTool === "line") {
      setShowLineSidebar(true)
      setShowRectangleSidebar(false)
      setShowCircleSidebar(false)
      setShowPenSidebar(false)
    } else if (activeTool === "pen") {
      setShowPenSidebar(true)
      setShowRectangleSidebar(false)
      setShowCircleSidebar(false)
      setShowLineSidebar(false)
    } else {
      setShowRectangleSidebar(false)
      setShowCircleSidebar(false)
      setShowLineSidebar(false)
      setShowPenSidebar(false)
    }
  }, [selectedElement, activeTool])

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative overflow-auto">
      <div className="mx-auto max-w-7xl">
        {/* Text Toolbar */}
        {(activeTool === "text" || (activeTool === "select" && selectedTextElement)) && (
          <div className="mb-8" ref={textToolbarRef}>
            <TextToolbar
              textSettings={textSettings}
              onTextSettingsChange={handleTextSettingsChange}
              selectedElementProps={selectedTextElement}
              onApplyStyleToSelectedText={handleApplyStyleToSelectedText}
              onClose={() => setActiveTool("select")}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex gap-6 justify-center" ref={mainContentAreaRef}>
          {/* Tools Button */}
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen)
              if (sidebarOpen) setShapesSidebarOpen(false)
            }}
            className={`tools-button flex items-center gap-2 px-4 py-3 rounded-r-full text-white ${
              sidebarOpen ? (shapesSidebarOpen ? "shapes-open" : "main-open") : ""
            }`}
            style={{
              backgroundColor: "var(--primary-color)",
              zIndex: 9999,
            }}
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span>Tools</span>
          </button>

          {/* Main Sidebar */}
          {sidebarOpen && (
            <>
              <div className="sidebar main-sidebar open">
                <div className="h-full flex flex-col p-4">
                  <h3 className="text-lg font-semibold mb-6 text-gray-800">Design Tools</h3>

                  <div className="flex flex-col gap-2">
                    {mainTools.map((tool) => (
                      <button
                        key={tool.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          // Modified condition for active tool styling
                          (activeTool === tool.id && !tool.isMenu) ||
                          (tool.id === "shapes" && shapesSidebarOpen) ||
                          (tool.id === "highlight" && showHighlightPicker)
                            ? "active-tool"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          if (tool.id === "shapes") {
                            handleToolClick(tool.id)
                          } else {
                            handleToolClick(tool.id)
                          }
                        }}
                      >
                        {tool.isLucideIcon ? (
                          <tool.icon className="w-5 h-5" />
                        ) : (
                          <img src={tool.icon || "/placeholder.svg"} alt={tool.label} className="w-5 h-5" />
                        )}
                        <span className="text-sm font-medium">{tool.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        setShowBackgroundPicker(true)
                        setColorWheelCanvasIdx(selectedCanvasIdx) // Ensure picker applies to current page
                        setSidebarOpen(false) // Close main sidebar when color picker opens
                      }}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all text-gray-700 hover:bg-gray-100 w-full`}
                    >
                      <AlignEndVerticalIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">Background Color</span>
                    </button>
                  </div>
                  <div className="mt-8">
                    <div className="text-xs font-medium mb-2 text-gray-500">STROKE COLOR</div>
                    <div className="relative">
                      <input
                        type="color"
                        value={squareSettings.strokeColor}
                        onChange={(e) => setSquareSettings((prev) => ({ ...prev, strokeColor: e.target.value }))}
                        className="w-full h-8 cursor-pointer"
                        title="Stroke Color"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <button
                      onClick={handleUndo}
                      disabled={historyIndex <= 0}
                      className={`p-2 rounded-lg transition-colors ${
                        historyIndex <= 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                      }`}
                      title="Undo"
                    >
                      <Undo className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleRedo}
                      disabled={historyIndex >= history.length - 1}
                      className={`p-2 rounded-lg transition-colors ${
                        historyIndex >= history.length - 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      title="Redo"
                    >
                      <Redo className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="fixed inset-0 bg-black/30 z-[9997]"
                onClick={() => {
                  setSidebarOpen(false)
                  setShapesSidebarOpen(false)
                }}
              />
            </>
          )}

          {/* Shapes Sidebar */}
          {shapesSidebarOpen && (
            <div className="sidebar shapes-sidebar open">
              <div className="h-full flex flex-col p-4">
                <button
                  onClick={() => setShapesSidebarOpen(false)}
                  className="flex items-center gap-3 p-3 mb-4 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Back to Tools</span>
                </button>

                <div className="flex flex-col gap-2">
                  {shapeTools.map((tool) => (
                    <button
                      key={tool.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        activeTool === tool.id ? "active-tool" : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={tool.onClick}
                    >
                      {tool.isLucideIcon ? (
                        <tool.icon className="w-5 h-5" />
                      ) : (
                        <img src={tool.icon || "/placeholder.svg"} alt={tool.label} className="w-5 h-5" />
                      )}
                      <span className="text-sm font-medium">{tool.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Text Sub-Sidebar */}
          {showTextSubSidebar && (
            <TextSubSidebar
              onAddText={() => addPredefinedText("text")}
              onAddHeading={() => addPredefinedText("heading")}
              onAddSubheading={() => addPredefinedText("subheading")}
              onAddBodyText={() => addPredefinedText("body")}
              onClose={() => setShowTextSubSidebar(false)}
            />
          )}

          {/* Rectangle Settings Sidebar */}
          {showRectangleSidebar && <RectangleSidebar selectedElement={selectedElement} />}

          {/* Circle Settings Sidebar */}
          {showCircleSidebar && <CircleSidebar selectedElement={selectedElement} />}

          {/* Line Settings Sidebar */}
          {showLineSidebar && <LineSidebar selectedElement={selectedElement} />}

          {/* Pen Settings Sidebar */}
          {showPenSidebar && <PenSidebar selectedElement={selectedElement} />}

          {/* Canvas Area - Centered */}
          <div className="flex-1 flex flex-col items-center">
            <div
              ref={canvasContainerRef}
              className="relative transition-all duration-300 canvas-container"
              style={{ position: "relative" }}
            >
              {pages.map((page, idx) => (
                <div
                  key={page.id}
                  className={`mb-12 relative max-w-4xl mx-auto cursor-pointer transition-all mt-16 ${
                    selectedCanvasIdx === idx ? "ring-4 ring-blue-500 ring-opacity-60 rounded-lg" : "ring-0"
                  }`}
                  onClick={(e) => {
                    setSelectedCanvasIdx(idx)
                    handleCanvasClick(e, idx)
                  }}
                  style={{ zIndex: selectedCanvasIdx === idx ? 10 : 1 }}
                >
                  <div className="small-color-wheel-icon-container">
                    <SmallColorWheelIcon
                      show={selectedCanvasIdx === idx && showColorIcon}
                      onClick={() => handleColorIconClick(idx)}
                    />
                  </div>

                  {/* Page Title */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-700">Page {idx + 1}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={addPage}
                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                        title="Add new page"
                      >
                        <Plus className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => {
                          setPages(pages.map((p, i) => (i === idx ? { ...p, isHidden: !p.isHidden } : p)))
                        }}
                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                        title={page.isHidden ? "Show page" : "Hide page"}
                      >
                        {page.isHidden ? (
                          <EyeOff className="w-5 h-5 text-gray-600" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setPages(pages.map((p, i) => (i === idx ? { ...p, isLocked: !p.isLocked } : p)))
                        }}
                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                        title={page.isLocked ? "Unlock page" : "Lock page"}
                      >
                        {page.isLocked ? (
                          <Lock className="w-5 h-5 text-gray-600" />
                        ) : (
                          <Unlock className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeletePage(idx)
                        }}
                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                        title="Delete this page"
                        disabled={pages.length <= 1}
                      >
                        <Trash2 className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Canvas */}
                  {!page.isHidden && (
                    <>
                      <Canvas
                        customSize={canvasSize}
                        elements={page.elements}
                        backgroundColor={page.backgroundColor}
                        isLocked={page.isLocked}
                        textSettings={textSettings}
                        primaryColor={primaryColor}
                        squareSettings={squareSettings}
                        highlightSettings={highlightSettings} // New: Pass highlight settings
                        editingTextElementId={editingTextElementId}
                        canvasIndex={idx} // Pass the canvas index
                        selectedCanvasIndex={selectedCanvasIdx} // Pass the selected canvas index
                        onElementsChange={handleElementsUpdateFromCanvas} // Changed prop name
                        onTransformationStart={handleTransformationStart} // New prop
                        onTransformationEnd={handleTransformationEnd} // New prop
                        onStartTextEdit={(
                          elementId,
                          text,
                          screenWidth,
                          screenHeight,
                          screenX,
                          screenY,
                          isInitialEdit,
                          borderColor,
                        ) => {
                          // Only set editing if this is the selected canvas
                          if (idx === selectedCanvasIdx) {
                            setEditingTextElementId(elementId)
                            handleTextEditStarted(text, screenWidth, screenHeight, screenX, screenY, isInitialEdit)
                          }
                        }}
                        activeTool={activeTool}
                        onTextEditComplete={(elementId, newText, isInitialEdit) =>
                          handleTextEditFinished(elementId, newText, 0, 0, 0, 0, false, isInitialEdit)
                        }
                        onAddTextAtClick={idx === selectedCanvasIdx ? handleAddTextAtClick : () => {}} // Only allow text addition on selected canvas
                        selectedElement={idx === selectedCanvasIdx ? selectedElement : null} // Only show selection on active canvas
                        setSelectedElement={setSelectedElement}
                        selectedTextElement={idx === selectedCanvasIdx ? selectedTextElement : null} // Only show text selection on active canvas
                        setSelectedTextElement={setSelectedTextElement}
                        onTextElementClick={handleTextElementClick} // RE-ADDED THIS PROP
                      />
                    </>
                  )}

                  {/* Color Picker Sidebar */}
                  {showBackgroundPicker && colorWheelCanvasIdx === idx && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={`fixed right-0 top-0 h-screen overflow-x-hidden w-[320px] bg-white shadow-lg z-[9998] overflow-y-auto border-l border-gray-200 p-4 color-picker-sidebar ${
                        showBackgroundPicker ? "open" : ""
                      }`}
                    >
                      <CustomColorPicker
                        color={page.backgroundColor || "#ffffff"}
                        onChange={(color) => {
                          const updatedPages = pages.map((p, i) => (i === idx ? { ...p, backgroundColor: color } : p))
                          setPages(updatedPages)
                          // No need to add to history here, as handleColorSelect already does it
                        }}
                        showPicker={true}
                        onToggle={handleColorPickerToggle}
                        onSaveColor={handleSaveColor}
                        savedColors={savedColors}
                        position="sidebar"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* In-place Textarea for editing */}
            {selectedElement &&
              editingTextElementId &&
              editingTextScreenCoords && ( // Ensure coords are available
                <CanvasTextInput
                  ref={canvasTextInputRef}
                  key={editingTextElementId}
                  x={editingTextScreenCoords.x}
                  y={editingTextScreenCoords.y}
                  width={editingTextScreenCoords.width}
                  height={editingTextScreenCoords.height} // Pass height
                  initialText={selectedElement.text}
                  textSettings={selectedElement}
                  isEditing={true}
                  onTextComplete={(
                    newText,
                    rect, // Receive rect object
                  ) =>
                    handleTextEditFinished(
                      selectedElement.id,
                      newText,
                      rect.width,
                      rect.height,
                      rect.x, // Use rect.x for left
                      rect.y, // Use rect.y for top
                      false,
                    )
                  }
                  onCancel={(
                    newText,
                    rect, // Receive rect object
                  ) =>
                    handleTextEditFinished(
                      selectedElement.id,
                      newText,
                      rect.width,
                      rect.height,
                      rect.x, // Use rect.x for left
                      rect.y, // Use rect.y for top
                      true,
                    )
                  }
                />
              )}
            {/* Add Page Button */}
            <div className="border-t border-b w-[1100px] border-gray-400 flex justify-center">
              <button
                onClick={addPage}
                className="flex items-center gap-2 px-4 py-2 text-black font-semibold hover:bg-gray-200 rounded-md transition-colors"
              >
                <Plus className="text-black" />
                Add page
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Highlight Color Picker Sidebar */}
      {showHighlightPicker && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`fixed right-0 top-0 h-screen overflow-x-hidden w-[320px] bg-white shadow-lg z-[9998] overflow-y-auto border-l border-gray-200 p-4 highlight-color-picker-sidebar ${
            showHighlightPicker ? "open" : ""
          }`}
        >
          <HighlightColorPicker
            color={highlightSettings.fillColor}
            onChange={(color) => {
              // Ensure only solid color is set for highlight
              const solidColor = color.includes("gradient") ? "#FFFF00" : color // Fallback to yellow if gradient
              setHighlightSettings((prev) => ({ ...prev, fillColor: solidColor }))
            }}
            showPicker={true}
            onToggle={(shouldShow) => setShowHighlightPicker(shouldShow)}
            onSaveColor={handleSaveColor}
            savedColors={savedColors}
            position="sidebar"
          />
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          background: white;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          z-index: 9998;
          transition: transform 0.3s ease;
          will-change: transform;
        }

        .main-sidebar {
          width: 280px;
          transform: translateX(-100%);
        }

        .main-sidebar.open {
          transform: translateX(0);
        }

        .shapes-sidebar {
          width: 280px;
          transform: translateX(-100%);
        }

        .shapes-sidebar.open {
          transform: translateX(280px);
        }

        .tools-button {
          position: fixed;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 9999;
          transition: transform 0.3s ease;
          will-change: transform;
        }

        .tools-button.main-open {
          transform: translate(280px, -50%);
        }

        .tools-button.shapes-open {
          transform: translate(560px, -50%);
        }

        .active-tool {
          background-color: var(--primary-color);
          color: white;
        }

        .active-tool:hover {
          background-color: var(--primary-color-light);
        }

        :root {
          --primary-color: #6b7280;
          --primary-color-light: #9ca3af;
        }
      `}</style>
    </div>
  )
}

export default WhiteBoard
