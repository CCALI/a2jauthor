import $ from 'jquery'
import CanMap from 'can-map'
import Component from 'can-component'
import template from './addendum-options.stache'

import 'can-map-define'

function toNumber (value, defaultValue) {
  if (typeof value !== 'number') {
    value = parseFloat(value)
  }
  if (isNaN(value)) {
    return defaultValue
  }
  return value
}

const pdfUnitsPerInch = 72
const defaultMarginPdfUnits = pdfUnitsPerInch // 1 inch margins

function pdfUnitsToInches (pdfUnits) {
  return pdfUnits / pdfUnitsPerInch
}

function inchesToPdfUnits (inches) {
  return inches * pdfUnitsPerInch
}

export function Resetable (attrs) {
  if (attrs.resetAttr) {
    throw new Error('`resetAttr` is reserved by Resetable')
  }

  return $.extend(attrs, {
    resetAttr (attrName) {
      const generator = this.constructor.defaultGenerators[attrName]
      if (!generator) {
        const defaultValue = this.constructor.defaults[attrName]
        return this.attr(attrName, defaultValue)
      }

      return this.attr(attrName, generator.call(this))
    }
  })
}

export const AddendumOptionsVm = CanMap.extend(
  Resetable({
    define: {
      pageWidth: {
        value () {
          return pdfUnitsToInches(
            this.attr('savedOptions.pageSize.width') ||
            this.attr('defaultPageSize.width')
          )
        }
      },

      pageHeight: {
        value () {
          return pdfUnitsToInches(
            this.attr('savedOptions.pageSize.height') ||
            this.attr('defaultPageSize.height')
          )
        }
      },

      topBottomMargin: {
        value () {
          return pdfUnitsToInches(
            this.attr('savedOptions.margins.top') ||
            defaultMarginPdfUnits
          )
        }
      },

      leftRightMargin: {
        value () {
          return pdfUnitsToInches(
            this.attr('savedOptions.margins.left') ||
            defaultMarginPdfUnits
          )
        }
      }
    },

    didInsertElement () {
      // resets with the props passed from the parent component
      this.onReset()
    },

    onUseDefaultSize () {
      this.attr('pageWidth', pdfUnitsToInches(this.attr('defaultPageSize.width')))
      this.attr('pageHeight', pdfUnitsToInches(this.attr('defaultPageSize.height')))
    },

    onSubmit () {
      const onSaveOptions = this.attr('onSaveOptions')
      const toPdfUnit = (x, y) =>
        inchesToPdfUnits(Math.max(toNumber(x, y)))
      const topBottomMargin = this.attr('topBottomMargin')
      const leftRightMargin = this.attr('leftRightMargin')
      const verticalMargin = toPdfUnit(topBottomMargin, 0)
      const horizontalMargin = toPdfUnit(leftRightMargin, 0)
      const options = {
        pageSize: {
          width: toPdfUnit(this.attr('pageWidth')),
          height: toPdfUnit(this.attr('pageHeight'))
        },
        margins: {
          top: verticalMargin,
          left: horizontalMargin,
          right: horizontalMargin,
          bottom: verticalMargin
        }
      }
      onSaveOptions(options)
    },

    onModalCancel () {
      this.onCancel()
    },

    onReset () {
      const fields = [
        'pageWidth',
        'pageHeight',
        'topBottomMargin',
        'leftRightMargin'
      ]
      fields.forEach(field => this.resetAttr(field))
    }
  })
)

export default Component.extend({
  view: template,
  leakScope: false,
  ViewModel: AddendumOptionsVm,
  tag: 'addendum-options',
  events: {
    inserted () {
      this.viewModel.didInsertElement()
    }
  }
})
