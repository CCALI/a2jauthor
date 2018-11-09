export function IdGenerator (prefix, idCounter = 0) {
  return function getUniqueId (existingIds) {
    const newId = prefix + idCounter++
    if (existingIds.indexOf(newId) !== -1) {
      return getUniqueId(existingIds)
    }
    return newId
  }
}

export function getArea (pointA, pointB) {
  const topLeft = {
    x: Math.min(pointA.x, pointB.x),
    y: Math.min(pointA.y, pointB.y)
  }
  const bottomRight = {
    x: Math.max(pointA.x, pointB.x),
    y: Math.max(pointA.y, pointB.y)
  }
  return {
    top: topLeft.y,
    left: topLeft.x,
    width: bottomRight.x - topLeft.x,
    height: bottomRight.y - topLeft.y
  }
}

export function getBoundaryArea (element) {
  const { width, height } = element.getClientRects()[0]
  return { top: 0, left: 0, width, height }
}

export function getRelativePoint (container, point) {
  const { top, left } = container.getClientRects()[0]
  return {
    x: Math.max(0, point.x - left),
    y: Math.max(0, point.y - top)
  }
}

export const clamp = (min, num, max) => Math.min(max, Math.max(num, min))

export function resizeAreaToPoint (area, dir, point) {
  if (dir.length === 2) {
    area = resizeAreaToPoint(area, dir.charAt(1), point)
    dir = dir.charAt(0)
  }
  const { top, left, width, height } = area
  const { x, y } = point
  switch (dir) {
    case 'n':
      return {
        top: clamp(0, y, top + height),
        left,
        width,
        height: Math.max(0, height + top - y)
      }
    case 's':
      return {
        top,
        left,
        width,
        height: Math.max(0, y - top)
      }
    case 'w':
      return {
        top,
        width: Math.max(0, width + left - x),
        left: clamp(0, x, left + width),
        height
      }
    case 'e':
      return {
        top,
        left,
        width: Math.max(0, x - left),
        height
      }
    default:
      throw new Error(`Direction "${dir}" is not valid`)
  }
}

export function fitWithinBoundary (boundary, area) {
  return {
    top: clamp(boundary.top, area.top, boundary.height - area.height),
    left: clamp(boundary.left, area.left, boundary.width - area.width),
    width: clamp(0, area.width, boundary.width),
    height: clamp(0, area.height, boundary.height)
  }
}

export function trimToBoundary (boundary, area) {
  return {
    top: clamp(0, area.top, boundary.height),
    left: clamp(0, area.left, boundary.width),
    width: clamp(0, area.width, boundary.width - area.left),
    height: clamp(0, area.height, boundary.height - area.top)
  }
}

export function containArea (boundary, point, area) {
  const overflowsBoundaryRight = point.x >= boundary.width
  const overflowsBoundaryBottom = point.y >= boundary.height
  if (overflowsBoundaryRight || overflowsBoundaryBottom) {
    return trimToBoundary(boundary, area)
  }
  return fitWithinBoundary(boundary, area)
}

export function moveAreaTo (area, startPoint, endPoint) {
  const dx = endPoint.x - startPoint.x
  const dy = endPoint.y - startPoint.y
  return {
    top: area.top + dy,
    left: area.left + dx,
    width: area.width,
    height: area.height
  }
}

export function nudgeArea (area, direction, delta = 1) {
  const { top, left, width, height } = area
  switch (direction) {
    case 'up':
      return {
        top: top - delta,
        left,
        width,
        height
      }
    case 'down':
      return {
        top: top + delta,
        left,
        width,
        height
      }
    case 'left':
      return {
        top,
        left: left - delta,
        width,
        height
      }
    case 'right':
      return {
        top,
        left: left + delta,
        width,
        height
      }
    default:
      throw new Error(`Direction "${direction}" is not valid`)
  }
}

export function nudgeAreaWithinBounds (boundary, area, dir, delta) {
  return fitWithinBoundary(boundary, nudgeArea(area, dir, delta))
}

export function moveAreaWithinBounds (boundary, area, startPoint, endPoint) {
  return fitWithinBoundary(boundary, moveAreaTo(area, startPoint, endPoint))
}
