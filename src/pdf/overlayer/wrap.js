function getMaximumLine (getTextWidth, availableWidth, content, minOneWord) {
  const words = content.split(' ')
  let line = []
  for (let i = 0; i < words.length; i++) {
    line.push(words[i])
    const text = line.join(' ')
    if (getTextWidth(text) > availableWidth) {
      line.pop()
      break
    }
  }

  if (line.length === 0 && minOneWord) {
    return words[0]
  }

  return line.join(' ')
}

module.exports = {
  getMaximumLine
}
