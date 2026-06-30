export const drawWrappedText = (ctx, lines, x, y, maxWidth, lineHeight, align, letterSpacing = 0) => {
  ctx.save()

  lines.forEach((lineObj, index) => {
    const lineText = lineObj.text
    const lineWidth = lineObj.width
    let lineX = x

    if (align === "center") {
      lineX = x + (maxWidth - lineWidth) / 2
    } else if (align === "right") {
      lineX = x + maxWidth - lineWidth
    }

    const lineY = y + index * lineHeight

    if (letterSpacing > 0) {
      // Draw with letter spacing
      let currentX = lineX
      for (let i = 0; i < lineText.length; i++) {
        const char = lineText[i]
        ctx.fillText(char, currentX, lineY)
        currentX += ctx.measureText(char).width + letterSpacing
      }
    } else {
      ctx.fillText(lineText, lineX, lineY)
    }
  })

  ctx.restore()
}

export const getMousePosition = (e) => {
  const canvas = e.target
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  }
}

export const getResizeHandle = (x, y, element) => {
  const handleSize = 8
  const padding = 2

  const boxX = element.x
  const boxY = element.y
  const boxWidth = element.width
  const boxHeight = element.height

  const handles = [
    { x: boxX - handleSize / 2, y: boxY - handleSize / 2, id: "top-left" },
    { x: boxX + boxWidth - handleSize / 2, y: boxY - handleSize / 2, id: "top-right" },
    { x: boxX - handleSize / 2, y: boxY + boxHeight - handleSize / 2, id: "bottom-left" },
    { x: boxX + boxWidth - handleSize / 2, y: boxY + boxHeight - handleSize / 2, id: "bottom-right" },
  ]

  for (const handle of handles) {
    if (x >= handle.x && x <= handle.x + handleSize && y >= handle.y && y <= handle.y + handleSize) {
      return handle.id
    }
  }

  return null
}

export const isPointInElement = (x, y, element) => {
  switch (element.type) {
    case "rectangle":
    case "text":
    case "image":
    case "highlight":
      return x >= element.x && x <= element.x + element.width && y >= element.y && y <= element.y + element.height

    case "circle":
      const centerX = element.x + element.width / 2
      const centerY = element.y + element.height / 2
      const radius = Math.min(element.width, element.height) / 2
      const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
      return distance <= radius

    case "oval":
      const ovalCenterX = element.x + element.width / 2
      const ovalCenterY = element.y + element.height / 2
      const radiusX = element.width / 2
      const radiusY = element.height / 2
      const normalizedX = (x - ovalCenterX) / radiusX
      const normalizedY = (y - ovalCenterY) / radiusY
      return normalizedX ** 2 + normalizedY ** 2 <= 1

    case "line":
      const lineThreshold = 5
      const A = element.y2 - element.y1
      const B = element.x1 - element.x2
      const C = element.x2 * element.y1 - element.x1 * element.y2
      const distance2 = Math.abs(A * x + B * y + C) / Math.sqrt(A * A + B * B)
      return distance2 <= lineThreshold

    case "pen":
      if (!element.path || element.path.length < 2) return false
      const threshold = 5
      for (let i = 0; i < element.path.length - 1; i++) {
        const p1 = element.path[i]
        const p2 = element.path[i + 1]
        const dist = distanceToLineSegment(x, y, p1.x, p1.y, p2.x, p2.y)
        if (dist <= threshold) return true
      }
      return false

    default:
      return false
  }
}

const distanceToLineSegment = (px, py, x1, y1, x2, y2) => {
  const A = px - x1
  const B = py - y1
  const C = x2 - x1
  const D = y2 - y1

  const dot = A * C + B * D
  const lenSq = C * C + D * D

  if (lenSq === 0) return Math.sqrt(A * A + B * B)

  const param = dot / lenSq

  if (param < 0) {
    return Math.sqrt(A * A + B * B)
  } else if (param > 1) {
    const E = px - x2
    const F = py - y2
    return Math.sqrt(E * E + F * F)
  } else {
    const projX = x1 + param * C
    const projY = y1 + param * D
    const G = px - projX
    const H = py - projY
    return Math.sqrt(G * G + H * H)
  }
}
