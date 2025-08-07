// utils/MeasureWrappedText.js
export default function measureWrappedText(
  ctx,
  text,
  maxWidth,
  fontSize,
  fontFamily,
  bold,
  italic,
  uppercase,
  letterSpacing,
) {
  ctx.font = `${bold ? "bold " : ""}${italic ? "italic " : ""}${fontSize}px ${fontFamily}`;
  ctx.letterSpacing = `${letterSpacing}px`;

  const lines = [];
  const paragraphs = text.split('\n'); // First, split by explicit newlines

  const lineHeight = fontSize * (1.2); // Assuming a default line height for measurement, consistent with CanvasTextInput

  let totalHeight = 0;
  let maxLineWidth = 0;

  paragraphs.forEach(paragraph => {
    let currentLine = '';
    const words = paragraph.split(' '); // Then, split each paragraph by spaces for word wrapping

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine === '' ? word : currentLine + ' ' + word;
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && currentLine !== '') {
        // If adding the word exceeds maxWidth, push currentLine and start a new one
        lines.push({ text: currentLine, width: ctx.measureText(currentLine).width });
        maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);
        currentLine = word; // Start new line with the current word
      } else {
        currentLine = testLine;
      }
    }
    // Push the last line of the paragraph
    if (currentLine !== '') {
      lines.push({ text: currentLine, width: ctx.measureText(currentLine).width });
      maxLineWidth = Math.max(maxLineWidth, ctx.measureText(currentLine).width);
    } else if (paragraph === '') {
      // Handle empty lines (e.g., two consecutive \n)
      lines.push({ text: '', width: 0 });
    }
  });

  totalHeight = lines.length * lineHeight;

  // Reset letter spacing after measurement
  ctx.letterSpacing = "0px";

  return { width: maxLineWidth, height: totalHeight, lines };
}
