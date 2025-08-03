"use client"

import { useRef, useEffect, useState } from "react"
import measureWrappedText from "../../utils/MeasureWrappedText"

// Helper for rounded rectangles
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2
    if (height < 2 * radius) radius = height / 2
    this.beginPath()
    this.moveTo(x + radius, y)
    this.arcTo(x + width, y, x + width, y + height, radius)
    this.arcTo(x + width, y + height, x, y + height, radius)
    this.arcTo(x, y + height, x, y, radius)
    this.arcTo(x, y, x + width, y, radius)
    this.closePath()
    return this
  }
}

// Helper for polygons
const generatePolygonPointsForCanvas = (sides, x, y, width, height) => {
  const points = []
  const centerX = x + width / 2
  const centerY = y + height / 2
  const radiusX = width / 2
  const radiusY = height / 2

  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
    const px = centerX + radiusX * Math.cos(angle)
    const py = centerY + radiusY * Math.sin(angle)
    points.push({ x: px, y: py })
  }
  return points
}

const getPointOnLine = (p1, p2, distance) => {
  const dx = p2.x - p1.x
  const dy = p2.y - p1.y
  const length = Math.sqrt(dx * dx + dy * dy)
  if (length === 0) return p1
  const ratio = distance / length
  return {
    x: p2.x - dx * ratio,
    y: p2.y - dy * ratio,
  }
}

const distance = (p1, p2) => Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)

const Canvas = ({
  customSize,
  elements,
  backgroundColor,
  selectedElement,
  isLocked,
  textSettings,
  primaryColor,
  squareSettings,
  highlightSettings, // New prop
  onElementsChange,
  editingTextElementId,
  onStartTextEdit,
  onAddTextAtClick,
  setSelectedElement,
  activeTool,
  selectedTextElement,
  setSelectedTextElement,
  onTransformationStart, // New prop
  onTransformationEnd, // New prop
  onTextElementClick, // ADDED THIS PROP
  canvasIndex, // Ensure canvasIndex is available
}) => {
  const canvasRef = useRef(null)
  const canvasWidth = customSize.width
  const canvasHeight = customSize.height
  const [editingText, setEditingText] = useState(null)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const cursorIntervalRef = useRef()
  const [isDrawing, setIsDrawing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeHandle, setResizeHandle] = useState(null)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [currentElement, setCurrentElement] = useState(null)
  const [penPath, setPenPath] = useState([])
  const [loadedImages, setLoadedImages] = useState(new Map())

  // Robust Gradient Parser
  const parseGradient = (gradientString, context, width, height) => {
    if (!gradientString) return null

    try {
      const normalized = gradientString.replace(/\s*([(),])\s*/g, "$1")

      if (normalized.startsWith("linear-gradient(")) {
        const content = normalized.slice("linear-gradient(".length, -1)
        const parts = content.split(/(?<!\d),(?!\d)/)

        let angle = 180
        let colorStops = []

        if (parts[0].includes("deg")) {
          angle = Number.parseFloat(parts[0])
          colorStops = parts.slice(1)
        } else if (parts[0].startsWith("to")) {
          const direction = parts[0]
          if (direction === "to top") angle = 0
          else if (direction === "to top right") angle = 45
          else if (direction === "to right") angle = 90
          else if (direction === "to bottom right") angle = 135
          else if (direction === "to bottom") angle = 180
          else if (direction === "to bottom left") angle = 225
          else if (direction === "to left") angle = 270
          else if (direction === "to top left") angle = 315
          colorStops = parts.slice(1)
        } else {
          colorStops = parts
        }

        const canvasAngleRad = ((angle - 90) * Math.PI) / 180

        const centerX = width / 2
        const centerY = height / 2
        const length = Math.sqrt(width * width + height * height)

        const x1 = centerX - (Math.cos(canvasAngleRad) * length) / 2
        const y1 = centerY - (Math.sin(canvasAngleRad) * length) / 2
        const x2 = centerX + (Math.cos(canvasAngleRad) * length) / 2
        const y2 = centerY + (Math.sin(canvasAngleRad) * length) / 2

        const gradient = context.createLinearGradient(x1, y1, x2, y2)

        colorStops.forEach((stop) => {
          const stopParts = stop.split(/\s+/)
          const color = stopParts[0]
          let position

          if (stopParts.length > 1) {
            const pos = stopParts[1]
            if (pos.endsWith("%")) {
              position = Number.parseFloat(pos) / 100
            } else if (!isNaN(Number.parseFloat(pos))) {
              position = Number.parseFloat(pos)
            }
          } else {
            position = colorStops.length > 1 ? colorStops.indexOf(stop) / (colorStops.length - 1) : 0
          }

          gradient.addColorStop(position, color)
        })

        return gradient
      }

      if (normalized.startsWith("radial-gradient(")) {
        const content = normalized.slice("radial-gradient(".length, -1)
        const parts = content.split(/(?<!\d),(?!\d)/)

        const gradient = context.createRadialGradient(
          width / 2,
          width / 2,
          0,
          width / 2,
          width / 2,
          Math.min(width, height) / 2,
        )

        const firstColorStop = parts.find(
          (part) =>
            part.startsWith("#") ||
            part.startsWith("rgb(") ||
            part.startsWith("rgba(") ||
            part.startsWith("hsl(") ||
            part.startsWith("hsla(") ||
            /^[a-z]+$/i.test(part),
        )

        const colorStops = firstColorStop ? parts.slice(parts.indexOf(firstColorStop)) : parts

        colorStops.forEach((stop, index) => {
          const stopParts = stop.split(/\s+/)
          const color = stopParts[0]
          let position

          if (stopParts.length > 1) {
            const pos = stopParts[1]
            if (pos.endsWith("%")) {
              position = Number.parseFloat(pos) / 100
            } else if (!isNaN(Number.parseFloat(pos))) {
              position = Number.parseFloat(pos) / (Math.min(width, height) / 2)
            }
          } else {
            position = colorStops.length > 1 ? index / (colorStops.length - 1) : 0
          }

          gradient.addColorStop(position, color)
        })

        return gradient
      }
    } catch (error) {
      console.error("Failed to parse gradient:", gradientString, error)
      return null
    }

    return null
  }

  // Image Preload
  useEffect(() => {
    const imageElements = elements.filter((el) => el.type === "image")
    imageElements.forEach((element) => {
      if (!loadedImages.has(element.src)) {
        const img = new window.Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          setLoadedImages((prev) => new Map(prev.set(element.src, img)))
        }
        img.onerror = () => {
          console.error("Failed to load image:", element.src)
        }
        img.src = element.src
      }
    })
  }, [elements, loadedImages])

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Draw background
    if (typeof backgroundColor === "string" && backgroundColor.includes("gradient")) {
      const gradient = parseGradient(backgroundColor, ctx, canvasWidth, canvasHeight)
      ctx.fillStyle = gradient || "#fff"
    } else {
      ctx.fillStyle = backgroundColor || "#fff"
    }
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Draw all elements
    elements.forEach((element) => {
      // NEW: Only draw text element if it's NOT currently being edited
      if (element.type === "text" && element.id === editingTextElementId) {
        return
      }
      renderElement(ctx, element)
    })

    if (currentElement) {
      renderElement(ctx, currentElement)
    }

    // Draw selection box
    if (selectedElement && !isLocked && selectedElement.id !== editingTextElementId) {
      drawSelectionBox(ctx, selectedElement)
    }

    // Draw lock overlay
    if (isLocked) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)"
      ctx.font = "48px Arial"
      ctx.textAlign = "center"
      ctx.fillText("🔒", canvasWidth / 2, canvasHeight / 2)
      ctx.textAlign = "left"
    }
  }, [
    elements,
    currentElement,
    selectedElement,
    backgroundColor,
    canvasWidth,
    canvasHeight,
    isLocked,
    loadedImages,
    editingTextElementId,
    squareSettings,
    textSettings,
    primaryColor,
    highlightSettings, // Add highlightSettings to dependencies
  ])

  const renderElement = (ctx, element) => {
    ctx.save()
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"
    ctx.translate(0.5, 0.5)
    // Set global alpha based on element's opacity or default square settings,
    // but override for 'highlight' type inside its case.
    ctx.globalAlpha = (element.opacity !== undefined ? element.opacity : squareSettings.opacity) / 100

    switch (element.type) {
      case "rectangle":
        ctx.strokeStyle = element.strokeColor !== undefined ? element.strokeColor : squareSettings.strokeColor
        ctx.lineWidth = element.strokeWidth !== undefined ? element.strokeWidth : squareSettings.strokeWidth
        ctx.fillStyle = element.fillColor !== undefined ? element.fillColor : squareSettings.fillColor

        const x = Math.floor(element.x)
        const y = Math.floor(element.y)
        const width = Math.floor(element.width)
        const height = Math.floor(element.height)
        const cornerRadius = element.cornerRadius !== undefined ? element.cornerRadius : squareSettings.cornerRadius
        const corners = element.corners !== undefined ? element.corners : squareSettings.corners

        if (corners === 4) {
          if (cornerRadius > 0) {
            ctx.roundRect(x, y, width, height, cornerRadius)
          } else {
            ctx.beginPath()
            ctx.rect(x, y, width, height)
          }
        } else {
          const polygonPoints = generatePolygonPointsForCanvas(corners, x, y, width, height)
          ctx.beginPath()

          if (polygonPoints.length > 0) {
            const firstPrevPoint = polygonPoints[polygonPoints.length - 1]
            const firstCurrentPoint = polygonPoints[0]
            const firstNextPoint = polygonPoints[1 % polygonPoints.length]

            const firstMaxRadiusForSegment =
              Math.min(distance(firstPrevPoint, firstCurrentPoint), distance(firstCurrentPoint, firstNextPoint)) / 2
            const firstEffectiveCornerRadius = Math.min(cornerRadius, firstMaxRadiusForSegment)

            const startSegment = getPointOnLine(firstPrevPoint, firstCurrentPoint, firstEffectiveCornerRadius)
            ctx.moveTo(startSegment.x, startSegment.y)

            for (let i = 0; i < polygonPoints.length; i++) {
              const currentPoint = polygonPoints[i]
              const nextPoint = polygonPoints[(i + 1) % polygonPoints.length]
              const prevPoint = polygonPoints[(i - 1 + polygonPoints.length) % polygonPoints.length]

              const maxRadiusForSegment =
                Math.min(distance(prevPoint, currentPoint), distance(currentPoint, nextPoint)) / 2
              const effectiveCornerRadiusForThisCorner = Math.min(cornerRadius, maxRadiusForSegment)

              const p1 = getPointOnLine(prevPoint, currentPoint, effectiveCornerRadiusForThisCorner)
              const p2 = getPointOnLine(nextPoint, currentPoint, effectiveCornerRadiusForThisCorner)

              ctx.lineTo(p1.x, p1.y)
              if (effectiveCornerRadiusForThisCorner > 0) {
                ctx.arcTo(currentPoint.x, currentPoint.y, p2.x, p2.y, effectiveCornerRadiusForThisCorner)
              } else {
                ctx.lineTo(currentPoint.x, currentPoint.y)
              }
            }
            ctx.closePath()
          }
        }
        ctx.fill()
        ctx.stroke()
        break

      case "circle":
        ctx.strokeStyle = element.strokeColor !== undefined ? element.strokeColor : squareSettings.strokeColor
        ctx.lineWidth = element.strokeWidth !== undefined ? element.strokeWidth : squareSettings.strokeWidth
        ctx.fillStyle = element.fillColor !== undefined ? element.fillColor : squareSettings.fillColor
        const centerX = Math.floor(element.x + element.width / 2)
        const centerY = Math.floor(element.y + element.height / 2)
        const radius = Math.floor(Math.min(Math.abs(element.width), Math.abs(element.height)) / 2)
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        break

        case "oval":
  ctx.strokeStyle = element.strokeColor !== undefined ? element.strokeColor : squareSettings.strokeColor;
  ctx.lineWidth = element.strokeWidth !== undefined ? element.strokeWidth : squareSettings.strokeWidth;
  ctx.fillStyle = element.fillColor !== undefined ? element.fillColor : squareSettings.fillColor;
  
  const centerx = Math.floor(element.x + element.width / 2);
  const centery = Math.floor(element.y + element.height / 2);
  const radiusX = Math.floor(Math.abs(element.width) / 2);
  const radiusY = Math.floor(Math.abs(element.height) / 2);
  
  ctx.beginPath();
  ctx.ellipse(centerx, centery, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  break;

      case "line":
        ctx.strokeStyle = element.strokeColor !== undefined ? element.strokeColor : squareSettings.strokeColor
        ctx.lineWidth = element.strokeWidth !== undefined ? element.strokeWidth : squareSettings.strokeWidth
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(Math.floor(element.x1), Math.floor(element.y1))
        ctx.lineTo(Math.floor(element.x2), Math.floor(element.y2))
        ctx.stroke()
        break

      case "pen":
        if (element.path && element.path.length > 1) {
          ctx.strokeStyle = element.strokeColor !== undefined ? element.strokeColor : squareSettings.strokeColor
          ctx.lineWidth = element.strokeWidth !== undefined ? element.strokeWidth : squareSettings.strokeWidth
          ctx.lineCap = "round"
          ctx.lineJoin = "round"
          ctx.beginPath()
          ctx.moveTo(Math.floor(element.path[0].x), Math.floor(element.path[0].y))
          for (let i = 1; i < element.path.length; i++) {
            ctx.lineTo(Math.floor(element.path[i].x), Math.floor(element.path[i].y))
          }
          ctx.stroke()
        }
        break

      case "text":
        ctx.fillStyle = element.color || textSettings.color
        ctx.font = `${element.bold ? "bold " : ""}${element.italic ? "italic " : ""}${element.fontSize || textSettings.fontSize}px ${element.fontFamily || textSettings.fontFamily}`
        ctx.textBaseline = "top"

        let textToDraw = element.text || ""
        if (element.uppercase) {
          textToDraw = textToDraw.toUpperCase()
        }

        const lineHeight =
          (element.fontSize || textSettings.fontSize) * (element.lineHeight || textSettings.lineHeight || 1.2)

        const { lines } = measureWrappedText(
          ctx,
          textToDraw,
          element.width,
          element.fontSize || textSettings.fontSize,
          element.fontFamily || textSettings.fontFamily,
          element.bold,
          element.italic,
          element.uppercase,
          element.letterSpacing || textSettings.letterSpacing,
        )

        if (lines.length > 0) {
          drawWrappedText(
            ctx,
            lines,
            element.x,
            element.y,
            element.width,
            lineHeight,
            element.align,
            element.letterSpacing,
          )
        }

        ctx.strokeStyle = element.color || textSettings.color
        ctx.lineWidth = 1

        let currentLineY = element.y
        lines.forEach((lineObj) => {
          const lineContent = lineObj.text
          const currentLineWidth = lineObj.width

          let lineStartX = element.x
          if (element.align === "center") {
            lineStartX = element.x + element.width / 2 - currentLineWidth / 2
          } else if (element.align === "right") {
            lineStartX = element.x + element.width - currentLineWidth
          }

          if (element.underline) {
            ctx.beginPath()
            const underlineY = Math.floor(currentLineY + (element.fontSize || textSettings.fontSize) + 2)
            ctx.moveTo(Math.floor(lineStartX), underlineY)
            ctx.lineTo(Math.floor(lineStartX + currentLineWidth), underlineY)
            ctx.stroke()
          }

          if (element.strikethrough) {
            ctx.beginPath()
            const strikethroughY = Math.floor(currentLineY + (element.fontSize || textSettings.fontSize) / 2)
            ctx.moveTo(Math.floor(lineStartX), strikethroughY)
            ctx.lineTo(Math.floor(lineStartX + currentLineWidth), strikethroughY)
            ctx.stroke()
          }
          currentLineY += lineHeight
        })
        break

      case "image":
        const img = loadedImages.get(element.src)
        if (img) {
          ctx.drawImage(
            img,
            Math.floor(element.x),
            Math.floor(element.y),
            Math.floor(element.width),
            Math.floor(element.height),
          )
        } else {
          ctx.strokeStyle = "#ddd"
          ctx.setLineDash([5, 5])
          ctx.strokeRect(
            Math.floor(element.x),
            Math.floor(element.y),
            Math.floor(element.width),
            Math.floor(element.height),
          )
          ctx.setLineDash([])
          ctx.fillStyle = "#f5f5f5"
          ctx.fillRect(
            Math.floor(element.x),
            Math.floor(element.y),
            Math.floor(element.width),
            Math.floor(element.height),
          )
          ctx.fillStyle = "#999"
          ctx.font = "14px Arial"
          ctx.textAlign = "center"
          ctx.fillText(
            "Loading...",
            Math.floor(element.x + element.width / 2),
            Math.floor(element.y + element.height / 2),
          )
          ctx.textAlign = "left"
        }
        break

      case "highlight": // New: Render highlight elements
        ctx.strokeStyle = "rgba(0,0,0,0)" // No stroke for highlight
        ctx.lineWidth = 0
        ctx.fillStyle = element.fillColor // Use element's specific fill color
        ctx.globalAlpha = element.opacity / 100 // Use element's specific opacity for highlight

        const highlightX = Math.floor(element.x)
        const highlightY = Math.floor(element.y)
        const highlightWidth = Math.floor(element.width)
        const highlightHeight = Math.floor(element.height)

        ctx.beginPath()
        ctx.rect(highlightX, highlightY, highlightWidth, highlightHeight)
        ctx.fill()
        // No stroke
        break
    }

    ctx.restore()
  }

  const drawSelectionBox = (ctx, element) => {
    const padding = 2
    const handleSize = 8

    ctx.save()
    ctx.translate(0.5, 0.5)

    let boxX = element.x
    let boxY = element.y
    let boxWidth = element.width
    let boxHeight = element.height

    if (element.type === "text") {
      const tempCanvas = document.createElement("canvas")
      const tempCtx = tempCanvas.getContext("2d")
      tempCtx.font = `${element.bold ? "bold " : ""}${element.italic ? "italic " : ""}${element.fontSize || textSettings.fontSize}px ${element.fontFamily || textSettings.fontFamily}`
      let textToDraw = element.text || ""
      if (element.uppercase) textToDraw = textToDraw.toUpperCase()
      const { width: measuredWidth, height: measuredHeight } = measureWrappedText(
        tempCtx,
        textToDraw,
        element.width,
        element.fontSize || textSettings.fontSize,
        element.fontFamily || textSettings.fontFamily,
        element.bold,
        element.italic,
        element.uppercase,
        element.letterSpacing || textSettings.letterSpacing,
      )
      if (element.align === "center") {
        boxX = element.x + (element.width - measuredWidth) / 2
      } else if (element.align === "right") {
        boxX = element.x + (element.width - measuredWidth)
      }
      boxY = element.y
      boxWidth = measuredWidth
      boxHeight = measuredHeight
    }

    ctx.strokeStyle = "#000000" // Black border
    ctx.lineWidth = 1
    ctx.setLineDash([0, 0])
    ctx.strokeRect(
      Math.floor(boxX - padding),
      Math.floor(boxY - padding),
      Math.floor(boxWidth + padding * 2),
      Math.floor(boxHeight + padding * 2),
    )
    ctx.setLineDash([])

    const corners = [
      { x: Math.floor(boxX - handleSize / 2), y: Math.floor(boxY - handleSize / 2), id: "top-left" },
      { x: Math.floor(boxX + boxWidth - handleSize / 2), y: Math.floor(boxY - handleSize / 2), id: "top-right" },
      { x: Math.floor(boxX - handleSize / 2), y: Math.floor(boxY + boxHeight - handleSize / 2), id: "bottom-left" },
      {
        x: Math.floor(boxX + boxWidth - handleSize / 2),
        y: Math.floor(boxY + boxHeight - handleSize / 2),
        id: "bottom-right",
      },
    ]
    corners.forEach((corner) => {
      ctx.fillStyle = "#000000" // Black handles
      ctx.fillRect(corner.x, corner.y, handleSize, handleSize)
      ctx.strokeStyle = "#000000" // Black handle borders
      ctx.lineWidth = 2
      ctx.strokeRect(corner.x, corner.y, handleSize, handleSize)
    })

    ctx.fillStyle = "rgba(0, 0, 0, 0.8)"
    ctx.font = "12px Arial"
    const info = `${Math.round(boxWidth)} × ${Math.round(boxHeight)}`
    const textWidth = ctx.measureText(info).width
    const infoX = Math.floor(boxX + boxWidth / 2 - textWidth / 2)
    const infoY = Math.floor(boxY - 20)
    ctx.fillRect(infoX - 4, infoY - 12, textWidth + 8, 16)
    ctx.fillStyle = "#ffffff"
    ctx.fillText(info, infoX, infoY)

    ctx.restore()
  }

  const getMousePosition = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const scaleX = canvasRef.current.width / rect.width
    const scaleY = canvasRef.current.height / rect.height

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const isPointInElement = (x, y, element) => {
  if (element.type === "line") {
    const dist = distanceToLine(x, y, element.x1, element.y1, element.x2, element.y2);
    return dist < 10;
  } else if (element.type === "pen") {
    if (!element.path || element.path.length === 0) return false;
    return element.path.some((point) => {
      const dist = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
      return dist < 10;
    });
  } else if (element.type === "text") {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.font = `${element.bold ? "bold " : ""}${
      element.italic ? "italic " : ""
    }${element.fontSize || textSettings.fontSize}px ${
      element.fontFamily || textSettings.fontFamily
    }`;
    let textToDraw = element.text || "";
    if (element.uppercase) textToDraw = textToDraw.toUpperCase();
    const { width: measuredWidth, height: measuredHeight } = measureWrappedText(
      tempCtx,
      textToDraw,
      element.width,
      element.fontSize || textSettings.fontSize,
      element.fontFamily || textSettings.fontFamily,
      element.bold,
      element.italic,
      element.uppercase,
      element.letterSpacing || textSettings.letterSpacing
    );
    let boxX = element.x;
    if (element.align === "center") {
      boxX = element.x + (element.width - measuredWidth) / 2;
    } else if (element.align === "right") {
      boxX = element.x + (element.width - measuredWidth);
    }
    const boxY = element.y;
    return (
      x >= boxX && x <= boxX + measuredWidth && y >= boxY && y <= boxY + measuredHeight
    );
  } else if (element.type === "oval") {
  const centerX = element.x + element.width / 2;
  const centerY = element.y + element.height / 2;
  const radiusX = Math.abs(element.width) / 2;
  const radiusY = Math.abs(element.height) / 2;
  
  // Check if point is inside the oval using ellipse equation
  const normalizedX = (x - centerX) / radiusX;
  const normalizedY = (y - centerY) / radiusY;
  return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
} else {
    // Default rectangle detection
    return (
      x >= element.x &&
      x <= element.x + element.width &&
      y >= element.y &&
      y <= element.y + element.height
    );
  }
};

  const distanceToLine = (px, py, x1, y1, x2, y2) => {
    const A = px - x1
    const B = py - y1
    const C = x2 - x1
    const D = y2 - y1

    const dot = A * C + B * D
    const lenSq = C * C + D * D
    let param = -1
    if (lenSq !== 0) param = dot / lenSq

    let xx, yy
    if (param < 0) {
      xx = x1
      yy = y1
    } else if (param > 1) {
      xx = x2
      yy = y2
    } else {
      xx = x1 + param * C
      yy = y1 + param * D
    }

    const dx = px - xx
    const dy = py - yy
    return Math.sqrt(dx * dx + dy * dy)
  }

  const getResizeHandle = (x, y, element) => {
    const handleSize = 8
    const tolerance = 5

    let boxX = element.x
    let boxY = element.y
    let boxWidth = element.width
    let boxHeight = element.height

    if (element.type === "text") {
      const tempCanvas = document.createElement("canvas")
      const tempCtx = tempCanvas.getContext("2d")
      tempCtx.font = `${element.bold ? "bold " : ""}${element.italic ? "italic " : ""}${element.fontSize || textSettings.fontSize}px ${element.fontFamily || textSettings.fontFamily}`
      let textToDraw = element.text || ""
      if (element.uppercase) textToDraw = textToDraw.toUpperCase()
      const { width: measuredWidth, height: measuredHeight } = measureWrappedText(
        tempCtx,
        textToDraw,
        element.width,
        element.fontSize || textSettings.fontSize,
        element.fontFamily || textSettings.fontFamily,
        element.bold,
        element.italic,
        element.uppercase,
        element.letterSpacing || textSettings.letterSpacing,
      )
      if (element.align === "center") {
        boxX = element.x + (element.width - measuredWidth) / 2
      } else if (element.align === "right") {
        boxX = element.x + (element.width - measuredWidth)
      }
      boxY = element.y
      boxWidth = measuredWidth
      boxHeight = measuredHeight
    }

    const handles = [
      { x: boxX, y: boxY, id: "top-left" },
      { x: boxX + boxWidth, y: boxY, id: "top-right" },
      { x: boxX, y: boxY + boxHeight, id: "bottom-left" },
      { x: boxX + boxWidth, y: boxY + boxHeight, id: "bottom-right" },
      { x: boxX + boxWidth / 2, y: boxY, id: "top" },
      { x: boxX + boxWidth / 2, y: boxY + boxHeight, id: "bottom" },
      { x: boxX, y: boxY + boxHeight / 2, id: "left" },
      { x: boxX + boxWidth, y: boxY + boxHeight / 2, id: "right" },
    ]

    for (const handle of handles) {
      const distance = Math.sqrt((x - handle.x) ** 2 + (y - handle.y) ** 2)
      if (distance <= handleSize + tolerance) {
        return handle.id
      }
    }
    return null
  }

  const handleMouseDown = (e) => {
  if (isLocked) return;

  const { x, y } = getMousePosition(e);

  if (editingTextElementId) {
    return;
  }

  if (activeTool === "text") {
    setSelectedElement(null);
    onAddTextAtClick(x, y);
    return;
  }

  if (activeTool === "select") {
    if (selectedElement) {
      const handle = getResizeHandle(x, y, selectedElement);
      if (handle) {
        setIsResizing(true);
        setResizeHandle(handle);
        setStartPoint({ x, y });
        onTransformationStart();
        return;
      }
    }

    let clickedElement = null;
    for (let i = elements.length - 1; i >= 0; i--) {
      if (isPointInElement(x, y, elements[i])) {
        clickedElement = elements[i];
        break;
      }
    }

    if (clickedElement) {
      setSelectedElement(clickedElement);
      setIsDragging(true);
      setStartPoint({ x, y });
      onTransformationStart();

      // Show the appropriate sidebar based on element type
      if (clickedElement.type === "oval" && onShowOvalSidebar) {
        onShowOvalSidebar();
      }

      if (clickedElement.type === "text" && onTextElementClick) {
        onTextElementClick(clickedElement, canvasIndex);
      }
      return;
    } else {
      setSelectedElement(null);
      if (onHideSidebars) {
        onHideSidebars();
      }
    }
    return;
  }

  // Hide all sidebars when starting to draw
  if (typeof onHideSidebars === "function") {
    onHideSidebars();
  }

  setIsDrawing(true);
  setSelectedElement(null);
  setStartPoint({ x, y });

  const newElement = {
    id: Date.now(),
    x,
    y,
  };

  switch (activeTool) {
    case "rectangle":
      newElement.type = "rectangle";
      newElement.width = 0;
      newElement.height = 0;
      newElement.corners = squareSettings.corners;
      newElement.cornerRadius = squareSettings.cornerRadius;
      newElement.strokeWidth = squareSettings.strokeWidth;
      newElement.opacity = squareSettings.opacity;
      newElement.fillColor = squareSettings.fillColor;
      newElement.strokeColor = squareSettings.strokeColor;
      setCurrentElement(newElement);
      break;

    case "circle":
      newElement.type = "circle";
      newElement.width = 0;
      newElement.height = 0;
      newElement.fillColor = squareSettings.fillColor;
      newElement.strokeColor = squareSettings.strokeColor;
      newElement.strokeWidth = squareSettings.strokeWidth;
      newElement.opacity = squareSettings.opacity;
      setCurrentElement(newElement);
      break;

    case "oval":
      newElement.type = "oval";
      newElement.width = 0;
      newElement.height = 0;
      newElement.fillColor = squareSettings.fillColor;
      newElement.strokeColor = squareSettings.strokeColor;
      newElement.strokeWidth = squareSettings.strokeWidth;
      newElement.opacity = squareSettings.opacity;
      setCurrentElement(newElement);
      break;

    case "line":
      newElement.type = "line";
      newElement.x1 = x;
      newElement.y1 = y;
      newElement.x2 = x;
      newElement.y2 = y;
      newElement.width = 0;
      newElement.height = 0;
      newElement.strokeColor = squareSettings.strokeColor;
      newElement.strokeWidth = squareSettings.strokeWidth;
      newElement.opacity = squareSettings.opacity;
      setCurrentElement(newElement);
      break;

    case "pen":
      newElement.type = "pen";
      newElement.path = [{ x, y }];
      newElement.width = 0;
      newElement.height = 0;
      newElement.strokeColor = squareSettings.strokeColor;
      newElement.strokeWidth = squareSettings.strokeWidth;
      newElement.opacity = squareSettings.opacity;
      setPenPath([{ x, y }]);
      setCurrentElement(newElement);
      break;

    case "highlight":
      newElement.type = "highlight";
      newElement.width = 0;
      newElement.height = 0;
      newElement.fillColor = highlightSettings.fillColor;
      newElement.opacity = highlightSettings.opacity;
      newElement.strokeWidth = 0;
      newElement.strokeColor = "rgba(0,0,0,0)";
      setCurrentElement(newElement);
      break;

    default:
      return;
  }
};

  useEffect(() => {
    if (editingText) {
      cursorIntervalRef.current = setInterval(() => {
        setCursorVisible((prev) => !prev)
      }, 500)
      return () => clearInterval(cursorIntervalRef.current)
    }
  }, [editingText])

  const handleDoubleClick = (e) => {
    if (isLocked || activeTool !== "select") return

    const { x, y } = getMousePosition(e)

    let clickedElement = null
    for (let i = elements.length - 1; i >= 0; i--) {
      if (isPointInElement(x, y, elements[i])) {
        clickedElement = elements[i]
        break
      }
    }

    if (clickedElement && clickedElement.type === "text") {
      setSelectedElement(clickedElement)
      const canvasElement = canvasRef.current
      const canvasRect = canvasElement.getBoundingClientRect()
      
      // Viewport-relative rect of the canvas

      const scaleX = canvasRect.width / canvasElement.width
      const scaleY = canvasRect.height / canvasElement.height

      // Calculate the actual rendered bounding box of the text element in canvas coordinates
      const tempCanvas = document.createElement("canvas")
      const tempCtx = tempCanvas.getContext("2d")
      tempCtx.font = `${clickedElement.bold ? "bold " : ""}${clickedElement.italic ? "italic " : ""}${clickedElement.fontSize}px ${clickedElement.fontFamily}`
      tempCtx.letterSpacing = `${clickedElement.letterSpacing || textSettings.letterSpacing}px`
      let textToDraw = clickedElement.text || ""
      if (clickedElement.uppercase) textToDraw = textToDraw.toUpperCase()

      // FIXED: Pass Number.POSITIVE_INFINITY to get the true unwrapped width
      const { width: unwrappedTextWidth } = measureWrappedText(
  tempCtx,
  textToDraw,
  Number.POSITIVE_INFINITY, // Ensure no wrapping
  clickedElement.fontSize || textSettings.fontSize,
  clickedElement.fontFamily || textSettings.fontFamily,
  clickedElement.bold,
  clickedElement.italic,
  clickedElement.uppercase,
  clickedElement.letterSpacing || textSettings.letterSpacing,
)




      // Calculate single line height based on font size and line height
      const singleLineHeight =
        (clickedElement.fontSize || textSettings.fontSize) *
        (clickedElement.lineHeight || textSettings.lineHeight || 1.2)

      let boxX_canvas = clickedElement.x
      if (clickedElement.align === "center") {
        boxX_canvas = clickedElement.x + (clickedElement.width - unwrappedTextWidth) / 2
      } else if (clickedElement.align === "right") {
        boxX_canvas = clickedElement.x + (clickedElement.width - unwrappedTextWidth)
      }
      const boxY_canvas = clickedElement.y
      // Calculate buffer based on textarea's padding (8px*2) + border (2px*2) + a slightly larger fudge factor
      const PADDING_BUFFER_HORIZONTAL = 8 * 2 + 2 * 2 + 20 // 16px padding + 4px border + 20px fudge = 40px
      const PADDING_BUFFER_VERTICAL = 8 * 2 + 2 * 2 + 5 // 16px padding + 4px border + 5px fudge = 25px

      const boxWidth_canvas = unwrappedTextWidth + PADDING_BUFFER_HORIZONTAL
      const boxHeight_canvas = singleLineHeight + PADDING_BUFFER_VERTICAL // Use single line height + vertical buffer

      // Convert canvas bounding box to viewport screen coordinates
      const screenX_viewport = boxX_canvas * scaleX + canvasRect.left
      const screenY_viewport = boxY_canvas * scaleY + canvasRect.top
      const screenWidth_viewport = boxWidth_canvas * scaleX
      const screenHeight_viewport = boxHeight_canvas * scaleY

      onStartTextEdit(
        clickedElement.id,
        clickedElement.text,
        screenWidth_viewport,
        screenHeight_viewport,
        screenX_viewport,
        screenY_viewport,
        true,
        primaryColor,
      )
    }
  }

  const handleMouseMove = (e) => {
    if (isLocked || editingTextElementId) return

    const { x, y } = getMousePosition(e)

    if (activeTool === "select" && selectedElement && !isDragging && !isResizing) {
      const handle = getResizeHandle(x, y, selectedElement)
      if (handle) {
        const cursorMap = {
          "top-left": "nw-resize",
          "top-right": "ne-resize",
          "bottom-left": "sw-resize",
          "bottom-right": "se-resize",
          top: "n-resize",
          bottom: "s-resize",
          left: "w-resize",
          right: "e-resize",
        }
        canvasRef.current.style.cursor = cursorMap[handle] || "default"
      } else if (isPointInElement(x, y, selectedElement)) {
        canvasRef.current.style.cursor = "move"
      } else {
        canvasRef.current.style.cursor = "default"
      }
    }

    if (isDragging && selectedElement) {
      const deltaX = x - startPoint.x
      const deltaY = y - startPoint.y

      let dragWidth = selectedElement.width
      let dragHeight = selectedElement.height

      if (selectedElement.type === "text") {
        const tempCanvas = document.createElement("canvas")
        const tempCtx = tempCanvas.getContext("2d")
        tempCtx.font = `${selectedElement.bold ? "bold " : ""}${selectedElement.italic ? "italic " : ""}${selectedElement.fontSize || textSettings.fontSize}px ${textSettings.fontFamily}`
        const { width: measuredWidth, height: measuredHeight } = measureWrappedText(
          tempCtx,
          selectedElement.text || "",
          selectedElement.width,
          selectedElement.fontSize || textSettings.fontSize,
          selectedElement.fontFamily || textSettings.fontFamily,
          selectedElement.bold,
          selectedElement.italic,
          selectedElement.uppercase,
          selectedElement.letterSpacing || textSettings.letterSpacing,
        )
        dragWidth = measuredWidth
        dragHeight = measuredHeight
      }

      const newX = Math.max(0, Math.min(canvasWidth - dragWidth, selectedElement.x + deltaX))
      const newY = Math.max(0, Math.min(canvasHeight - dragHeight, selectedElement.y + deltaY))

      const updatedElements = elements.map((element) =>
        element.id === selectedElement.id ? { ...element, x: newX, y: newY } : element,
      )

      onElementsChange(updatedElements, true) // Pass true for continuous operation
      setSelectedElement({ ...selectedElement, x: newX, y: newY })
      setStartPoint({ x, y })
    }

    if (isResizing && selectedElement) {
      const deltaX = x - startPoint.x
      const deltaY = y - startPoint.y

      let newX = selectedElement.x
      let newY = selectedElement.y
      let newWidth = selectedElement.width
      let newHeight = selectedElement.height

      const originalX = selectedElement.x
      const originalY = selectedElement.y
      const originalWidth = selectedElement.width
      const originalHeight = selectedElement.height

      switch (resizeHandle) {
        case "top-left":
          newX = originalX + deltaX
          newY = originalY + deltaY
          newWidth = originalWidth - deltaX
          newHeight = originalHeight - deltaY
          break
        case "top-right":
          newY = originalY + deltaY
          newWidth = originalWidth + deltaX
          newHeight = originalHeight - deltaY
          break
        case "bottom-left":
          newX = originalX + deltaX
          newWidth = originalWidth - deltaX
          newHeight = originalHeight + deltaY
          break
        case "bottom-right":
          newWidth = originalWidth + deltaX
          newHeight = originalHeight + deltaY
          break
        case "top":
          newY = originalY + deltaY
          newHeight = originalHeight - deltaY
          break
        case "bottom":
          newHeight = originalHeight + deltaY
          break
        case "left":
          newX = originalX + deltaX
          newWidth = originalWidth - deltaX
          break
        case "right":
          newWidth = originalWidth + deltaX
          break
      }

      const MIN_SIZE = 20
      if (newWidth < MIN_SIZE) {
        if (resizeHandle.includes("left")) {
          newX = originalX + originalWidth - MIN_SIZE
        }
        newWidth = MIN_SIZE
      }
      if (newHeight < MIN_SIZE) {
        if (resizeHandle.includes("top")) {
          newY = originalY + originalHeight - MIN_SIZE
        }
        newHeight = MIN_SIZE
      }

      newX = Math.max(0, Math.min(canvasWidth - newWidth, newX))
      newY = Math.max(0, Math.min(canvasHeight - newHeight, newY))

      const updatedElement = { ...selectedElement, x: newX, y: newY, width: newWidth, height: newHeight }

      if (selectedElement.type === "text") {
        const currentFontSize = selectedElement.fontSize || textSettings.fontSize
        const scaleFactor = newWidth / originalWidth

        const newFontSize = Math.max(8, Math.min(currentFontSize * scaleFactor, 100))

        const tempCanvas = document.createElement("canvas")
        const tempCtx = tempCanvas.getContext("2d")

        const { height: measuredHeight } = measureWrappedText(
          tempCtx,
          selectedElement.text || "",
          newWidth,
          newFontSize,
          selectedElement.fontFamily || textSettings.fontFamily,
          selectedElement.bold,
          selectedElement.italic,
          selectedElement.uppercase,
          selectedElement.letterSpacing || textSettings.letterSpacing,
        )

        updatedElement.fontSize = newFontSize
        updatedElement.height = measuredHeight
      }

      const updatedElements = elements.map((element) => (element.id === selectedElement.id ? updatedElement : element))

      onElementsChange(updatedElements, true) // Pass true for continuous operation
      setSelectedElement(updatedElement)

      // ADD THIS: Update selectedTextElement if it's a text element
      if (updatedElement.type === "text" && selectedTextElement && selectedTextElement.id === updatedElement.id) {
        setSelectedTextElement(updatedElement)
      }

      setStartPoint({ x, y })
    }

    if (isDrawing && currentElement) {
      const updatedElement = { ...currentElement }

      switch (activeTool) {
        case "rectangle":
        case "circle":
        case "highlight": // New: Update highlight element dimensions
          updatedElement.width = x - startPoint.x
          updatedElement.height = y - startPoint.y
          setCurrentElement(updatedElement)
          break

        case "line":
          updatedElement.x2 = x
          updatedElement.y2 = y
          updatedElement.x = Math.min(startPoint.x, x)
          updatedElement.y = Math.min(startPoint.y, y)
          updatedElement.width = Math.abs(x - startPoint.x)
          updatedElement.height = Math.abs(y - startPoint.y)
          setCurrentElement(updatedElement)
          break

          case "oval":
  updatedElement.width = x - startPoint.x;
  updatedElement.height = y - startPoint.y;
  setCurrentElement(updatedElement);
  break;

        case "pen":
          const newPath = [...penPath, { x, y }]
          setPenPath(newPath)
          updatedElement.path = newPath

          const xs = newPath.map((p) => p.x)
          const ys = newPath.map((p) => p.y)
          updatedElement.x = Math.min(...xs)
          updatedElement.y = Math.min(...ys)
          updatedElement.width = Math.max(...xs) - updatedElement.x
          updatedElement.height = Math.max(...ys) - updatedElement.y
          setCurrentElement(updatedElement)
          break
      }
    }
  }

  const handleMouseUp = () => {
    if (isDrawing && currentElement) {
      onElementsChange([...elements, currentElement], false) // Pass false for discrete operation (new element added)
      setCurrentElement(null)
      setPenPath([])
    }

    if (isDragging || isResizing) {
      onTransformationEnd() // Signal end of continuous operation
    }

    setIsDrawing(false)
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)

    if (canvasRef.current) {
      canvasRef.current.style.cursor = activeTool === "select" ? "default" : "crosshair"
    }
  }

  const drawWrappedText = (context, lines, x, y, maxWidth, lineHeight, align, letterSpacing) => {
    context.letterSpacing = `${letterSpacing}px`

    let currentY = y
    lines.forEach((lineObj) => {
      let lineX = x
      const lineContent = lineObj.text
      const currentLineWidth = lineObj.width

      if (align === "center") {
        lineX = x + maxWidth / 2 - currentLineWidth / 2
      } else if (align === "right") {
        lineX = x + maxWidth - currentLineWidth
      }
      context.fillText(lineContent, Math.floor(lineX), Math.floor(currentY))
      currentY += lineHeight
    })
    context.letterSpacing = "0px"
  }

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        className="border border-gray-300 bg-white canvas-element"
        style={{
          maxWidth: "100%",
          maxHeight: "600px",
          cursor: isLocked
            ? "not-allowed"
            : editingTextElementId
              ? "text"
              : activeTool === "select"
                ? "default"
                : "crosshair",
          opacity: isLocked ? 0.8 : 1,
        }}
      />
    </div>
  )
}

export default Canvas
