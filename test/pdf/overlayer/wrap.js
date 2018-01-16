const test = require('ava')
const {getMaximumLine} = require('../../../lib/pdf/overlayer/wrap')

const getTextWidth = text => text.length * 10

test('getMaximumLine should return fitting text', t => {
  const content = 'Hello world, welcome to the world.'
  // SANITY INDEX: 0123456789012345678901234567890123
  const indexToWidth = index => (index + 1) * 10

  {
    const availableWidth = indexToWidth(6)
    t.deepEqual(
      getMaximumLine(getTextWidth, availableWidth, content),
      'Hello'
    )
  }

  {
    const availableWidth = Infinity
    t.deepEqual(
      getMaximumLine(getTextWidth, availableWidth, content),
      content
    )
  }

  {
    const availableWidth = 0
    t.deepEqual(
      getMaximumLine(getTextWidth, availableWidth, content),
      ''
    )
  }

  {
    const minOneWord = true
    const availableWidth = 0
    t.deepEqual(
      getMaximumLine(getTextWidth, availableWidth, content, minOneWord),
      'Hello'
    )
  }
})
