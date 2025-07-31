// utils/MeasureWrappedText.js
// Description: This utility function measures text and wraps it based on a maximum width,
// returning an array of lines and the total measured width and height.
const measureWrappedText = (
  context,
  text,
  maxWidth,
  fontSize,
  fontFamily,
  bold,
  italic,
  uppercase,
  letterSpacing = 0,
) => {
  context.save()
  context.font = `${bold ? "bold " : ""}${italic ? "italic " : ""}${fontSize}px ${fontFamily}`
  context.letterSpacing = `${letterSpacing}px`

  const words = text.split(" ")
  const lines = []
  let currentLine = words[0] || ""
  let totalMeasuredWidth = 0
  let totalMeasuredHeight = 0

  if (uppercase) {
    currentLine = currentLine.toUpperCase()
  }

  for (let i = 1; i < words.length; i++) {
    let word = words[i]
    if (uppercase) {
      word = word.toUpperCase()
    }
    const testLine = currentLine + " " + word
    const metrics = context.measureText(testLine)
    const testWidth = metrics.width

    if (testWidth > maxWidth && i > 0) {
      const lineMetrics = context.measureText(currentLine)
      lines.push({ text: currentLine, width: lineMetrics.width })
      totalMeasuredWidth = Math.max(totalMeasuredWidth, lineMetrics.width)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }

  if (currentLine !== "") {
    const lineMetrics = context.measureText(currentLine)
    lines.push({ text: currentLine, width: lineMetrics.width })
    totalMeasuredWidth = Math.max(totalMeasuredWidth, lineMetrics.width)
  }

  // Calculate total height based on lines and font size
  const lineHeight = fontSize * 1.2 // Assuming 1.2 as default line height
  totalMeasuredHeight = lines.length * lineHeight

  context.restore()
  return { lines, width: totalMeasuredWidth, height: totalMeasuredHeight }
}

export default measureWrappedText
