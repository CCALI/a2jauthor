import DefineMap from 'can-define/map/map'
import Component from 'can-component'
import template from './authors.stache'

export const AboutAuthorsVM = DefineMap.extend('AboutAuthorsVM', {
  // passed in via about.stache
  guide: {},

  // number of authors
  authorCount: {
    default () {
      return this.workingList.length
    }
  },
  // used to maintain a list as it's being edited. could contain more than is being displayed
  workingList: {
    default () {
      return this.guide.authors
    }
  },

  // list of authors display in UI, could show less than the working list,
  // and will be saved to the guide on nav away
  authorList: {
    value ({ listenTo, resolve }) {
      // defaults to incoming workingList
      resolve(this.workingList)

      listenTo('authorCount', (ev, selectedValue) => {
        const currentCount = this.workingList.length
        const diff = selectedValue - currentCount

        if (diff === 0) {
          resolve(this.workingList)
        } else if (selectedValue > currentCount) {
          for (let i = 0; i < diff; i++) {
            this.workingList.push(new window.TAuthor())
          }
          resolve(this.workingList)
        } else {
          const newSubList = this.workingList.slice(0, selectedValue)
          resolve(newSubList)
        }
      })
    }
  },
  // TODO: remove when global gGuide is removed
  saveAuthors (workingList) {
    if (workingList && workingList.length) {
      const authors = []
      for (let author of workingList) {
        authors.push(author)
      }
      // global guide is auto saved
      if (window.gGuide) {
        window.gGuide['authors'] = authors
      } else {
        console.error('Authors save failed: no window.gGuide found')
      }
    }
  },

  connectedCallback () {
    const vm = this

    // proxy authors list changes to global gGuide for future save
    const updateGlobalGuideAuthors = (ev, authorList) => {
      vm.saveAuthors(authorList)
    }

    vm.listenTo('authorList', updateGlobalGuideAuthors)

    return () => {
      // CanJS office hours Q
      vm.saveAuthors(vm.authorList)
      vm.stopListening('authorList', updateGlobalGuideAuthors)
    }
  }
})

export default Component.extend({
  tag: 'about-authors',
  view: template,
  leakScope: false,
  ViewModel: AboutAuthorsVM
})
