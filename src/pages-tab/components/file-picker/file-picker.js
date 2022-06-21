import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './file-picker.stache'
import constants from 'a2jauthor/src/models/constants'

export const FilePicker = DefineMap.extend('FilePicker', {
  appState: {},

  // obj[key] like page['textAudioURL']
  obj: {
    type: 'any'
  },
  key: {
    type: 'text',
    default: ''
  },
  label: {
    type: 'text',
    default: 'File Upload'
  },
  filterText: { // ObservableProxy
    value ({ lastSet, listenTo, resolve }) {
      listenTo(lastSet, function (val) {
        this.obj[this.key] = val
        resolve(val)
      })
      resolve(this.obj[this.key])
    }
  },

  // list of items[{name}] that appear in the dropdown
  items: {},
  accept: { type: 'text', default: '' },

  legacyFlattenPath (file) {
    return file.split('\\').pop().split('/').pop()
  },

  get legacyIgnoreFoldersInFileNameFilter () {
    return this.legacyFlattenPath(this.filterText.toLowerCase())
  },

  get matchedItems () {
    return this.items.filter(
      i => i.name && i.name.toLowerCase().indexOf(this.legacyIgnoreFoldersInFileNameFilter) !== -1
    )
  },

  get unmatchedItems () {
    return this.items.filter(
      i => i.name && i.name.toLowerCase().indexOf(this.legacyIgnoreFoldersInFileNameFilter) === -1
    )
  },

  textAndBool (value, pickerVisible) {
    this.filterText = value
    if (pickerVisible) {
      this.toggleBool(pickerVisible)
    }
  },

  newObservableBool (tf = false) {
    return new DefineMap({ value: tf })
  },
  toggleBool (observableBool) {
    observableBool.value = !observableBool.value
  },

  validName (newValue) {
    return (!newValue) || (!this.items) || (newValue.indexOf('http') === 0) || (
      this.items.filter(i => i.name.toLowerCase() === this.legacyFlattenPath(newValue.toLowerCase())).length > 0
    )
  },

  uploadFile (fileInputEl) {
    if (fileInputEl.files && fileInputEl.files.length) {
      const formData = new FormData() // eslint-disable-line
      formData.append('files[]', fileInputEl.files[0])
      window.fetch(`${constants.uploadURL}${this.appState.guideId}`, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(result => {
          const file = result && result.files && result.files[0]
          this.items.push(file)
          const filename = file && file.name
          filename && (this.filterText = filename)
        })
    }
  }
})

export default Component.extend({
  tag: 'file-picker',
  view: template,
  leakScope: false,
  ViewModel: FilePicker
})
