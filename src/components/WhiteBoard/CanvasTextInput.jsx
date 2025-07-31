"use client"
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react"

const CanvasTextInput = forwardRef(
  ({ x, y, width, initialText, textSettings, primaryColor, onTextComplete, onCancel, isEditing }, ref) => {
    const textareaRef = useRef(null)
    const containerRef = useRef(null)
    const [text, setText] = useState(initialText)
    const [dimensions, setDimensions] = useState({ width: width || 200, height: 40 })
    const [position, setPosition] = useState({ x, y })

    // Expose blur method to parent component
    useImperativeHandle(ref, () => ({
      blur: () => {
        if (textareaRef.current) {
          textareaRef.current.blur()
        }
      },
    }))

    // Apply styles and focus on mount
    useEffect(() => {
      if (textareaRef.current && isEditing) {
        textareaRef.current.style.fontFamily = textSettings.fontFamily
        textareaRef.current.style.fontSize = `${textSettings.fontSize}px`

        // Use requestAnimationFrame to ensure DOM is ready for accurate measurements
        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.focus()
            if (
              initialText === "Click to type" ||
              initialText === "Add a Heading" ||
              initialText === "Add a Subheading" ||
              initialText === "Add a little bit of body text"
            ) {
              textareaRef.current.select()
            }
            adjustHeight() // Adjust height immediately after focus/select
          }
        })
      }
    }, [isEditing, initialText, textSettings])

    const adjustHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        setDimensions((prev) => ({ ...prev, height: textareaRef.current.scrollHeight }))
      }
    }

    const handleComplete = (cancelled = false) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        if (cancelled && onCancel) {
          onCancel(text, rect)
        } else if (onTextComplete) {
          onTextComplete(text, rect)
        }
      }
    }

    const handleBlur = () => {
      handleComplete(false)
    }

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleComplete(false)
      }
      if (e.key === "Escape") {
        e.preventDefault()
        handleComplete(true)
      }
    }

    const handleInputChange = (e) => {
      setText(e.target.value)
    }

    if (!isEditing) return null

    return (
      <div
        ref={containerRef}
        className="canvas-text-input"
        style={{
          position: "absolute",
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 1000,
        }}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          style={{
            width: `${dimensions.width}px`,
            border: `2px dashed ${primaryColor || "#000000"}`,
            borderRadius: "4px",
            padding: "0px",
            outline: "none",
            resize: "none",
            fontFamily: textSettings.fontFamily || "Arial",
            fontSize: `${textSettings.fontSize || 16}px`,
            color: textSettings.color || "#000000",
            fontWeight: textSettings.bold ? "bold" : "normal",
            fontStyle: textSettings.italic ? "italic" : "normal",
            textAlign: textSettings.align || "left",
            lineHeight: `${textSettings.lineHeight || 1.2}`,
            background: "rgba(255, 255, 255, 0.95)",
            // Removed minHeight to allow dynamic height based on content
          }}
        />
      </div>
    )
  },
)

CanvasTextInput.displayName = "CanvasTextInput"
export default CanvasTextInput
