"use client";

import React, {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import measureWrappedText from "../../utils/MeasureWrappedText"; // Import the utility for text measurement

const CanvasTextInput = forwardRef(
  (
    {
      x,
      y,
      width: initialWidth, // This will now act as the maximum width for wrapping
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
    const measureRef = useRef(null); // Used for accurate text measurement

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
      if (textareaRef.current && measureRef.current) {
        const ta = textareaRef.current;
        const fontSizePx = textSettings.fontSize || 16;
        const fontFamily = textSettings.fontFamily || "Arial, sans-serif";
        const bold = textSettings.bold;
        const italic = textSettings.italic;
        const uppercase = textSettings.uppercase;
        const letterSpacing = textSettings.letterSpacing || 0;
        const lineHeight = (textSettings.lineHeight || 1.2) * fontSizePx; // Use lineHeight from settings

        // Temporarily apply styles to measureRef for accurate measurement of wrapped text
        Object.assign(measureRef.current.style, {
          fontFamily: fontFamily,
          fontSize: `${fontSizePx}px`,
          fontWeight: bold ? "bold" : "normal",
          fontStyle: italic ? "italic" : "normal",
          letterSpacing: `${letterSpacing}px`,
          textTransform: uppercase ? "uppercase" : "none",
          lineHeight: `${lineHeight}px`,
          whiteSpace: "pre-wrap", // Crucial for multi-line measurement
          wordBreak: "break-word", // Allow long words to break
          width: `${initialWidth}px`, // Constrain width for measurement to simulate wrapping
          boxSizing: "border-box",
          padding: "8px", // Match textarea padding
        });

        // Use a temporary canvas context to measure text accurately
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.font = `${bold ? "bold " : ""}${italic ? "italic " : ""}${fontSizePx}px ${fontFamily}`;
        tempCtx.letterSpacing = `${letterSpacing}px`;

        const textToMeasure = uppercase ? text.toUpperCase() : text;

        const { width: measuredContentWidth, height: measuredContentHeight } = measureWrappedText(
          tempCtx,
          textToMeasure || " ",
          initialWidth, // Pass the initialWidth as the max width for wrapping
          fontSizePx,
          fontFamily,
          bold,
          italic,
          uppercase,
          letterSpacing
        );

        const padding = 8;
        const borderWidth = 1;
        const totalHorizontalPadding = 2 * (padding + borderWidth);
        const totalVerticalPadding = 2 * (padding + borderWidth);
        const verticalBuffer = 5; // Extra buffer for textarea height

        // The width should adjust to content up to initialWidth, then wrap.
        // If the content is shorter than initialWidth, the input should shrink.
        // Add a small buffer (e.g., 15px) to prevent horizontal scrollbar flicker
        const newWidth = Math.max(50, Math.min(measuredContentWidth + totalHorizontalPadding + 15, initialWidth));

        // The height should always adjust to the measured wrapped text height.
        const newHeight = measuredContentHeight + totalVerticalPadding + verticalBuffer;

        setDimensions((oldDims) => {
          // Only update if there's a significant change to prevent unnecessary re-renders
          if (
            Math.abs(oldDims.width - newWidth) > 1 ||
            Math.abs(oldDims.height - newHeight) > 1
          ) {
            return { width: newWidth, height: newHeight };
          }
          return oldDims;
        });

        // Apply calculated dimensions to the textarea element directly for immediate effect
        ta.style.width = `${newWidth}px`;
        ta.style.height = `${newHeight}px`;
        ta.style.lineHeight = `${lineHeight}px`; // Ensure textarea line-height matches measurement
      }
    };

    useEffect(() => {
      adjustSize();
    }, [text, textSettings.fontFamily, textSettings.fontSize, textSettings.letterSpacing, textSettings.lineHeight, textSettings.bold, textSettings.italic, textSettings.uppercase, initialWidth]);

    useEffect(() => {
      if (textareaRef.current && isEditing) {
        const ta = textareaRef.current;
        const fontSizePx = textSettings.fontSize || 16;
        const lineHeightValue = (textSettings.lineHeight || 1.2) * fontSizePx;

        ta.style.fontFamily = textSettings.fontFamily || "Arial, sans-serif";
        ta.style.fontSize = `${fontSizePx}px`;
        ta.style.letterSpacing = `${textSettings.letterSpacing || 0}px`;
        ta.style.fontWeight = textSettings.bold ? "bold" : "normal";
        ta.style.fontStyle = textSettings.italic ? "italic" : "normal";
        ta.style.color = textSettings.color || "#000";
        ta.style.lineHeight = `${lineHeightValue}px`;
        ta.style.textTransform = textSettings.uppercase ? "uppercase" : "none"; // Apply uppercase style

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
      // If only Enter is pressed, allow default behavior (insert newline)
      if (e.key === "Enter" && !e.shiftKey) {
        // Do nothing, let the browser handle the newline
      }
      // If Shift + Enter is pressed, complete the editing
      else if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault(); // Prevent default newline
        handleComplete(false);
      }
      // If Escape is pressed, cancel the editing
      else if (e.key === "Escape") {
        e.preventDefault();
        handleComplete(true);
      }
    };

    const handleInputChange = (e) => setText(e.target.value);

    const handleMouseDown = () => {}; // Keep this to prevent premature blur

    if (!isEditing) return null;

    return (
      <>
        {/* Hidden span for accurate text measurement */}
        <span
          ref={measureRef}
          style={{
            position: "absolute",
            top: -9999,
            left: -9999,
            visibility: "hidden",
            padding: 0,
            margin: 0,
            border: "none",
            // Styles will be applied dynamically in adjustSize
          }}
        >
          {/* Content will be set dynamically */}
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
              padding: "0px",
              fontFamily: textSettings.fontFamily || "Arial, sans-serif",
              fontSize: `${textSettings.fontSize || 16}px`,
              letterSpacing: `${textSettings.letterSpacing || 0}px`,
              fontWeight: textSettings.bold ? "bold" : "normal",
              fontStyle: textSettings.italic ? "italic" : "normal",
              whiteSpace: "pre-wrap", // Crucial for allowing newlines and wrapping
              overflow: "hidden", // Hide scrollbars as size is adjusted dynamically
              boxSizing: "border-box",
              color: textSettings.color || "#000",
              caretColor: textSettings.color || "#000",
              lineHeight: `${(textSettings.fontSize || 16) * 1.3}px`, // Ensure line-height matches measurement
              userSelect: "text",
              MozUserSelect: "text",
              WebkitUserSelect: "text",
              msUserSelect: "text",
              textTransform: textSettings.uppercase ? "uppercase" : "none", // Apply uppercase style
            }}
          />
        </div>
      </>
    );
  }
);

export default CanvasTextInput;
