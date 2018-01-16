export function getBinary(red, green, blue) {
  const blackThreshold = 50;
  return (
    red < blackThreshold && green < blackThreshold && blue < blackThreshold
  );
}

export function getBinaryFromColorData(colorData) {
  const binaryData = [];
  for (let i = 0; i < colorData.length; i += 4) {
    const red = colorData[i];
    const green = colorData[i + 1];
    const blue = colorData[i + 2];
    binaryData[i / 4] = getBinary(red, green, blue);
  }
  return binaryData;
}

// How long must a line be to be a line?
const lineLengthThreshold = 10;

export function containsLine(binary) {
  const hits = binary.reduce((c, i) => c + (i ? 1 : 0), 0);
  return hits > lineLengthThreshold;
}

export function getFirstTopBound(getBinaryData, bounds, point) {
  const withinBounds = withinMaxArea(bounds);
  const verticalSlice = getBinaryData(
    withinBounds({
      top: bounds.top,
      left: point.x,
      width: 1,
      height: bounds.top + bounds.height - point.y
    })
  );
  let searchIndex = 0;
  while (searchIndex < verticalSlice.length) {
    if (verticalSlice[searchIndex]) {
      const topBound = bounds.top + searchIndex;
      const horizontalSlice = getBinaryData(
        withinBounds({
          top: topBound,
          left: point.x - lineLengthThreshold,
          width: lineLengthThreshold * 2,
          height: 1
        })
      );
      const hasLine = containsLine(horizontalSlice);
      if (hasLine) {
        return topBound;
      }
    }

    searchIndex++;
  }
}

export function getFirstBottomBound(getBinaryData, bounds, point) {
  const withinBounds = withinMaxArea(bounds);
  const verticalSlice = getBinaryData(
    withinBounds({
      top: point.y,
      left: point.x,
      width: 1,
      height: bounds.top + bounds.height - point.y
    })
  );
  let searchIndex = 0;
  while (searchIndex < verticalSlice.length) {
    if (verticalSlice[searchIndex]) {
      const topBound = point.y + searchIndex;
      const horizontalSlice = getBinaryData(
        withinBounds({
          top: topBound,
          left: point.x - lineLengthThreshold,
          width: lineLengthThreshold * 2,
          height: 1
        })
      );
      const hasLine = containsLine(horizontalSlice);
      if (hasLine) {
        return topBound;
      }
    }

    searchIndex++;
  }
}

export function getFirstLeftBound(getBinaryData, bounds, point) {
  const withinBounds = withinMaxArea(bounds);
  const horizontalSlice = getBinaryData(
    withinBounds({
      top: point.y,
      left: bounds.left,
      width: bounds.width - (point.x - bounds.left),
      height: 1
    })
  );
  let searchIndex = 0;
  while (searchIndex < horizontalSlice.length) {
    if (horizontalSlice[searchIndex]) {
      const leftBound = point.x - searchIndex;
      const verticalSlice = getBinaryData(
        withinBounds({
          top: point.y - lineLengthThreshold,
          left: leftBound,
          width: 1,
          height: lineLengthThreshold * 2
        })
      );
      const hasLine = containsLine(verticalSlice);
      if (hasLine) {
        return leftBound;
      }
    }

    searchIndex++;
  }
}

export function getFirstRightBound(getBinaryData, bounds, point) {
  const withinBounds = withinMaxArea(bounds);
  const horizontalSlice = getBinaryData(
    withinBounds({
      top: point.y,
      left: point.x,
      width: bounds.left + bounds.width - point.x,
      height: 1
    })
  );
  let searchIndex = 0;
  while (searchIndex < horizontalSlice.length) {
    if (horizontalSlice[searchIndex]) {
      const leftBound = point.x + searchIndex;
      const verticalSlice = getBinaryData(
        withinBounds({
          top: point.y - lineLengthThreshold,
          left: leftBound,
          width: 1,
          height: lineLengthThreshold * 2
        })
      );
      const hasLine = containsLine(verticalSlice);
      if (hasLine) {
        return leftBound;
      }
    }

    searchIndex++;
  }
}

export const withinMaxArea = maxArea => area => ({
  top: Math.max(maxArea.top, area.top),
  left: Math.max(maxArea.left, area.left),
  width: Math.min(maxArea.width, area.width),
  height: Math.min(maxArea.height, area.height)
});

export const getBinaryArea = context => area => {
  const { top, left, width, height } = area;
  const imageData = context.getImageData(left, top, width, height);
  return getBinaryFromColorData(imageData.data);
};

export function getClosestBounds(context, point, searchRadius) {
  const contextArea = getContextArea(context);
  const searchArea = {
    top: point.y - searchRadius,
    left: point.x - searchRadius,
    width: searchRadius * 2,
    height: searchRadius * 2
  };
  const contextSearchArea = withinMaxArea(contextArea)(searchArea);
  const getBinaryData = getBinaryArea(context);

  const top = getFirstTopBound(getBinaryData, contextSearchArea, point);
  const left = getFirstLeftBound(getBinaryData, contextSearchArea, point);
  const right = getFirstRightBound(getBinaryData, contextSearchArea, point);
  const bottom = getFirstBottomBound(getBinaryData, contextSearchArea, point);
  return [top, left, right, bottom];
}

export function getFirstWallFrom(context, point, maxWidth, step) {
  const imageData = context.getImageData(0, point.y, maxWidth, 1);
  const binaryLine = getBinaryFromColorData(imageData);
  const size = binaryLine.length;
  let index = point.x;
  while (index > 0 && index < size) {
    if (binaryLine[index]) {
      const readTop = Math.max(0, point.y - lineLengthThreshold);
      const readHeight = readTop + 2 * lineLengthThreshold;
      const verticalImage = context.getImageData(0, readTop, 1, readHeight);
      const binarySlice = getBinaryFromColorData(verticalImage);
      const lineHits = binarySlice.reduce(
        (count, bit) => (bit ? count + 1 : count),
        0
      );

      if (lineHits >= lineLengthThreshold) {
        return index;
      }
    }

    index += step;
  }
}

export function getFirstLeftWall(context, point, maxWidth) {
  return getFirstWallFrom(context, point, maxWidth, -1);
}

export function getFirstRightWall(context, point, maxWidth) {
  return getFirstWallFrom(context, point, maxWidth, 1);
}

export function getFullHorizontalArea(
  context,
  topPoint,
  bottomPoint,
  maxWidth
) {
  const topArea = getFullHorizontalLine(context, topPoint, maxWidth);
  const bottomArea = getFullHorizontalLine(context, bottomPoint, maxWidth);
  if (!(topArea && bottomArea)) {
    return;
  }

  const midPoint = {
    x: Math.floor((topPoint.x + bottomPoint.x) / 2),
    y: Math.floor((topPoint.y + bottomPoint.y) / 2)
  };
  const wallStart = getFirstLeftWall(context, midPoint, maxWidth);
  let left = bottomArea.left;
  {
    const hasCloserWall = wallStart && wallStart > left;
    if (hasCloserWall) {
      left = wallStart;
    }
  }

  const wallEnd = getFirstRightWall(context, midPoint, maxWidth);
  let right = bottomArea.left + bottomArea.width;
  {
    const hasCloserWall = wallEnd && wallEnd > left;
    if (hasCloserWall) {
      right = wallEnd;
    }
  }

  const nudge = 2; // we are too flesh with the top line
  return {
    top: topArea.top + nudge,
    left,
    width: right - left,
    height: bottomArea.top - topArea.top - nudge
  };
}

export function getFullHorizontalLine(context, centerPoint, maxWidth) {
  const imageData = context.getImageData(0, centerPoint.y, maxWidth, 1);
  const binaryLine = getBinaryFromColorData(imageData.data);
  let start;
  let leftIndex = centerPoint.x;
  while (leftIndex > 0) {
    if (binaryLine[leftIndex]) {
      start = leftIndex--;

      continue;
    }
    break;
  }

  let end;
  let rightIndex = centerPoint.x;
  while (rightIndex < binaryLine.length) {
    if (binaryLine[rightIndex]) {
      end = rightIndex++;
      continue;
    }
    break;
  }

  if (start && end && start !== end) {
    return {
      top: centerPoint.y,
      left: start,
      width: end - start,
      height: 0
    };
  }
}

export function getContextArea(context) {
  return {
    top: 0,
    left: 0,
    width: +context.canvas.width,
    height: +context.canvas.height
  };
}

export function attemptAutofill(context, point) {
  const bounds = getClosestBounds(context, point, 60);
  const isBound = x => typeof x === "number";
  const boundCount = bounds.filter(isBound).length;
  const [top, left, right, bottom] = bounds;
  const isBox = boundCount === 4;
  if (isBox) {
    return withinMaxArea(getContextArea(context))({
      top,
      left,
      width: right - left,
      height: bottom - top
    });
  }

  const maxWidth = parseInt(context.canvas.width, 10);
  const isFloorAndCeiling = boundCount === 2 && isBound(top) && isBound(bottom);
  if (isFloorAndCeiling) {
    const topPoint = {
      y: top,
      x: point.x
    };
    const bottomPoint = {
      y: bottom,
      x: point.x
    };
    return getFullHorizontalArea(context, topPoint, bottomPoint, maxWidth);
  }

  const isFloor = boundCount === 1 && isBound(bottom);
  if (isFloor) {
    const center = {
      y: bottom,
      x: point.x
    };
    const fullLine = getFullHorizontalLine(context, center, maxWidth);
    if (fullLine) {
      const areaHeight = 50; // guess
      return {
        top: fullLine.top - areaHeight,
        left: fullLine.left,
        width: fullLine.width,
        height: areaHeight
      };
    }
  }
}
