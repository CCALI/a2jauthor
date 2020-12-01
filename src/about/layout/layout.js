import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './layout.stache'
import { promptFile } from 'a2jauthor/src/utils/uploader'

export const AboutLayoutVm = DefineMap.extend('AboutLayoutVm', {
  // passed in via app.stache
  guide: {},

  uploadImageFile (guideProp) {
    return promptFile('image/jpg, image/png, image/jpeg', '.jpg, .jpeg or .png')
      .then(file => {
        return new Promise((resolve, reject) => {
          const reader = new window.FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = error => reject(error)
          console.log('file', file)
          reader.readAsDataURL(file)
        })
      })
      .then(imageFile => {
        console.log('imageFile', imageFile)
      })
  }
})

export default Component.extend({
  tag: 'about-layout',
  view: template,
  leakScope: false,
  ViewModel: AboutLayoutVm
})
