import DefineMap from 'can-define/map/map'
import ckeArea from '~/src/utils/ckeditor-area'

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
