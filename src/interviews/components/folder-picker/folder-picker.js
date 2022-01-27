import DefineMap from 'can-define/map/map'
// import DefineList from 'can-define/list/list'
import Component from 'can-component'
import template from './folder-picker.stache'

export const FolderPickerVM = DefineMap.extend('FolderPickerVM', {
  guideListRow: {}, /* a row/record from CAJA_WS listGuides() api, meta data about the actual interview */
  folders: {}, // a List in the shape = [ { path: 'foo/bar' }, ... ]
  savedCallback: {},

  get interviewFolder () {
    return this.guideListRow && this.guideListRow.folder
  },

  folderSearch: {
    value ({ lastSet, listenTo, resolve }) {
      listenTo('interviewFolder', resolve)
      listenTo(lastSet, resolve)
      resolve(this.interviewFolder || '')
    }
  },

  get foldersFiltered () {
    const folders = this.folders || []
    const filtered = folders.filter(f => {
      const path = (f && f.path) || 'Unsorted'
      return path.toLowerCase().indexOf(this.folderSearch.toLowerCase()) !== -1
    })
    return filtered
  },

  savePromise: {},

  setFolderTo (path) {
    // TODO: update this line to a promise returned from an API call that sets `this.guideListRow.folder` to `path` in the DB
    const promise = new Promise((resolve, reject) => { setTimeout(() => { resolve({success: true}) }, 1500) })

    // TODO: The rest of this shouldn't need to change
    this.savePromise = promise.then(() => {
      // update local instance to match what we just saved to the DB
      this.guideListRow.folder = path

      // call the callback, which currently just closes this folder-picker instance
      if (typeof this.savedCallback === 'function') {
        this.savedCallback(path, this.guideListRow)
      }
    })

    return this.savePromise
  }
})

export default Component.extend({
  tag: 'folder-picker',
  view: template,
  leakScope: false,
  ViewModel: FolderPickerVM
})
