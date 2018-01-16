const joi = require('joi')
const {fonts} = require('./fonts')
const {checks} = require('./checks')

const nonNegative = joi.number().min(0).required()
const contentString = joi.string().required()
const arrayOf = type => joi.array().items(type).required()
const mustBe = val => joi.any().valid(val).required()
const oneOf = vals => joi.any().valid(vals).required()
const struct = obj => joi.object().keys(obj).required()
const matrix = type => joi.array().items(joi.array().items(type))

// The coordinate system origin is the top-left.
// Going down is increasing, as is going right.
const Rect = struct({
  top: nonNegative,
  left: nonNegative,
  width: nonNegative,
  height: nonNegative
})

const Size = struct({
  width: nonNegative,
  height: nonNegative
})

const TextOptions = struct({
  fontSize: nonNegative,
  fontName: oneOf(fonts.getSupportedFontNames()),
  textAlign: oneOf(['left', 'right']),

  // XXXXXX Hexadecimal
  textColor: joi.string().hex().required()
})

const OverflowOptions = struct({
  style: oneOf([
    'overflow-to-addendum',
    'everything-to-addendum',
    'clip-overflow'
  ]),

  // ignored if style is "clip-overflow"
  addendumLabel: contentString
})

const Text = struct({
  type: mustBe('text'),
  page: nonNegative,
  content: contentString,
  area: Rect,
  text: TextOptions
})

const MultilineText = struct({
  type: mustBe('multiline-text'),
  content: contentString,
  overflow: OverflowOptions,
  addendumText: TextOptions,
  lines: arrayOf(struct({
    page: nonNegative,
    area: Rect,
    text: TextOptions
  }))
})

const TableText = struct({
  type: mustBe('table-text'),
  columns: matrix(Text),
  addendumLabel: contentString,

  // each text.area.top is ignored for placement
  // columns are placed dynamically on the addendum
  // only the spacing between areas is preserved
  addendumColumns: matrix(Text)
})

const Checkmark = struct({
  type: mustBe('checkmark'),
  page: nonNegative,
  icon: oneOf(checks.getSupportedCheckNames()),
  area: Rect
})

const AddendumOptions = struct({
  pageSize: Size,
  margins: struct({
    top: nonNegative,
    left: nonNegative,
    right: nonNegative,
    bottom: nonNegative
  }),
  labelStyle: TextOptions
})

const Patch = joi.alternatives([
  Text,
  MultilineText,
  TableText,
  Checkmark
])

const Overlay = struct({
  patches: arrayOf(Patch),
  addendum: AddendumOptions
})

function validate (overlay) {
  return joi.validate(overlay, Overlay).error
}

module.exports = {validate}
