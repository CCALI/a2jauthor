import DefineMap from 'can-define/map/map'
import ckeArea from '~/src/utils/ckeditor-area'

// shared with file-picker and var-picker-field, so the popover dropdown lists can only show one at a time across the app
export const onlyOne = { observableBoolAtATime: undefined }
// CCALI/a2jauthor#334
document.addEventListener('focus', ev => {
  // only try to close it if it's open
  if (onlyOne.observableBoolAtATime && onlyOne.observableBoolAtATime.value) {
    // ie doesn't have closest
    if (ev && ev.target && ev.target.closest) {
      // if focus moved outside of var picker field or file picker components...
      const targetInScope = ev.target.closest('.auto-close-shared-bool-on-outside-focus')
      // In Safari, that check ^ may fail in cases when it should not...
      const didSafariMakeOurTabIndexNeg1DialogTheTarget = (!targetInScope) && (/apple/i.test(navigator.vendor)) && (ev.target.role === 'dialog')
      const safariRelatedTargetInScope = didSafariMakeOurTabIndexNeg1DialogTheTarget && ev.relatedTarget && ev.relatedTarget.closest('.auto-close-shared-bool-on-outside-focus')
      const eventIsOutsideOfScope = !(targetInScope || safariRelatedTargetInScope)
      if (eventIsOutsideOfScope) {
        onlyOne.observableBoolAtATime.value = false // auto close when focused elsewhere
      }
    }
  }
}, true)

export const ckeFactory = (obj, key, label, placeholder) => ckeArea({
  label,
  placeholder: placeholder || '',
  value: (obj[key] || '').trim(),
  change: function (val) {
    obj[key] = (val || '').trim()
  }
})

export const ObservableProxy = DefineMap.extend('ObservableProxy', {
  obj: {},
  key: {},
  value: {
    value ({ lastSet, listenTo, resolve }) {
      listenTo(lastSet, function (val) {
        this.obj[this.key] = val
        resolve(val)
      })
      resolve(this.obj[this.key])
    }
  }
})
