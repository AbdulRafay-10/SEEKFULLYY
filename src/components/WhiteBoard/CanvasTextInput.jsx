"use client";

import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

const CanvasTextInput = forwardRef(
  (
    {
      x,
      y,
      width: initialWidth,
      initialText = "",
      textSettings = {},
      primaryColor = "#000",
      onTextComplete,
      onCancel,
      isEditing,
    },
    ref
  ) => {
    const textareaRef = useRef(null);
    const containerRef = useRef(null);
    const measureRef = useRef(null);

    const [text, setText] = useState(initialText);

    const [dimensions, setDimensions] = useState({
      width: initialWidth || 100,
      height: 40,
    });

    const [position] = useState({ x, y });

    const initialSelectDoneRef = useRef(false);

    useImperativeHandle(ref, () => ({
      blur: () => {
        if (textareaRef.current) textareaRef.current.blur();
      },
    }));

    const adjustSize = () => {
      if (measureRef.current && textareaRef.current) {
        measureRef.current.textContent = text || " ";

        const measuredWidth = measureRef.current.offsetWidth;

        const fontSizePx = textSettings.fontSize || 16;
        const padding = 8;
        const borderWidth = 1;
        const verticalBuffer = 5;
        const EXTRA_BUFFER = 15; // Extra horizontal buffer to prevent scrollbar flicker

        const totalHorizontal = 2 * (padding + borderWidth);
        const totalVertical = 2 * (padding + borderWidth);

        // Add EXTRA_BUFFER here to avoid horizontal scrollbar flickering
        const newWidth = Math.max(
          measuredWidth + totalHorizontal + EXTRA_BUFFER,
          50
        );
        const fixedHeight = fontSizePx * 1.3 + totalVertical + verticalBuffer;

        setDimensions((oldDims) => {
          if (
            Math.abs(oldDims.width - newWidth) > 2 ||
            Math.abs(oldDims.height - fixedHeight) > 2
          ) {
            return { width: newWidth, height: fixedHeight };
          }
          return oldDims;
        });

        textareaRef.current.style.height = `${fixedHeight}px`;
        textareaRef.current.style.lineHeight = `${fontSizePx * 1.3}px`;
      }
    };

    useEffect(() => {
      adjustSize();
    }, [text, textSettings.fontFamily, textSettings.fontSize, textSettings.letterSpacing]);

    useEffect(() => {
      if (textareaRef.current && isEditing) {
        const ta = textareaRef.current;
        const fontSizePx = textSettings.fontSize || 16;
        const verticalBuffer = 5;
        const lineHeightValue = fontSizePx * 1.3;

        ta.style.fontFamily = textSettings.fontFamily || "Arial, sans-serif";
        ta.style.fontSize = `${fontSizePx}px`;
        ta.style.letterSpacing = `${textSettings.letterSpacing || 0}px`;
        ta.style.fontWeight = textSettings.bold ? "bold" : "normal";
        ta.style.fontStyle = textSettings.italic ? "italic" : "normal";
        ta.style.color = textSettings.color || "#000";
        ta.style.lineHeight = `${lineHeightValue}px`;

        if (!initialSelectDoneRef.current) {
          ta.focus();

          if (
            [
              "Click to type",
              "Add a Heading",
              "Add a Subheading",
              "Add a little bit of body text",
            ].includes(initialText)
          ) {
            ta.select();
          }

          initialSelectDoneRef.current = true;
        } else {
          ta.focus();
        }

        adjustSize();
      }
    }, [isEditing, initialText, textSettings]);

    const handleComplete = (cancelled = false) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();

        if (cancelled && onCancel) onCancel(text, rect);
        else if (onTextComplete) onTextComplete(text, rect);
      }
      initialSelectDoneRef.current = false;
    };

    const handleBlur = () => handleComplete(false);

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleComplete(false);
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleComplete(true);
      }
    };

    const handleInputChange = (e) => setText(e.target.value);

    const handleMouseDown = () => {};

    if (!isEditing) return null;

    return (
      <>
        <span
          ref={measureRef}
          style={{
            position: "absolute",
            top: -9999,
            left: -9999,
            whiteSpace: "nowrap",
            fontFamily: textSettings.fontFamily || "Arial, sans-serif",
            fontSize: `${textSettings.fontSize || 16}px`,
            letterSpacing: `${textSettings.letterSpacing || 0}px`,
            fontWeight: textSettings.bold ? "bold" : "normal",
            fontStyle: textSettings.italic ? "italic" : "normal",
            visibility: "hidden",
            padding: 0,
            margin: 0,
            border: "none",
          }}
        >
          {text || " "}
        </span>

        <div
          ref={containerRef}
          style={{
            position: "absolute",
            top: position.y,
            left: position.x,
            width: dimensions.width,
            height: dimensions.height,
            border: `1px solid ${primaryColor}`,
            boxSizing: "border-box",
            backgroundColor: "#fff",
            borderRadius: 4,
            padding: 0,
            overflow: "hidden",
            zIndex: 1000,
          }}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onMouseDown={handleMouseDown}
            spellCheck={false}
            autoFocus
            style={{
              width: "100%",
              height: "100%",
              outline: "none",
              border: "none",
              backgroundColor: "transparent",
              resize: "none",
              padding: "8px",
              fontFamily: textSettings.fontFamily || "Arial, sans-serif",
              fontSize: `${textSettings.fontSize || 16}px`,
              letterSpacing: `${textSettings.letterSpacing || 0}px`,
              fontWeight: textSettings.bold ? "bold" : "normal",
              fontStyle: textSettings.italic ? "italic" : "normal",
              whiteSpace: "nowrap",
              overflowX: "auto",
              overflowY: "hidden",
              boxSizing: "border-box",
              color: textSettings.color || "#000",
              caretColor: textSettings.color || "#000",
              lineHeight: `${(textSettings.fontSize || 16) * 1.3}px`,
              userSelect: "text",
              MozUserSelect: "text",
              WebkitUserSelect: "text",
              msUserSelect: "text",
            }}
          />
        </div>
      </>
    );
  }
);

export default CanvasTextInput;
