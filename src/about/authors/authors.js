import DefineMap from 'can-define/map/map'
import CanMap from 'can-map'
import CanList from 'can-list'
import Component from 'can-component'
import template from './authors.stache'

// legacy type is window.TAuthor
const Author = CanMap.extend('Author', {
  name: '',
  title: '',
  organization: '',
  email: ''
})

Author.List = CanList.extend('AuthorList', {
  '#': Author
})

export const AboutAuthorsVM = DefineMap.extend('AboutAuthorsVM', {
  // passed in via about.stache
  guide: {},

  // number of authors
  authorCount: {
    default () {
      return this.authorList.length
    }
  },
  // used to maintain a list as it's being edited. could contain more than is being display
  authorList: {
    default () {
      return this.guide.authors
    }
  },

  // list of authors display in UI, could show less than the working list,
  // and will be saved to the guide on nav away
  displayList: {
    value ({ listenTo, resolve }) {
      // defaults to incoming authorList
      resolve(this.authorList)

      listenTo('authorCount', (ev, selectedValue) => {
        const currentCount = this.authorList.length
        const diff = selectedValue - currentCount

        if (diff === 0) {
          resolve(this.authorList)
        } else if (selectedValue > currentCount) {
          for (let i = 0; i < diff; i++) {
            this.authorList.push(new window.TAuthor())
          }
          resolve(this.authorList)
        } else {
          const newSubList = this.authorList.slice(0, selectedValue)
          resolve(newSubList)
        }
      })
    }
  },
  // TODO: remove when global gGuide is removed
  saveAuthors (authorList) {
    if (authorList && authorList.length) {
      const authors = []
      for (let author of authorList) {
        authors.push(author)
      }
      // global guide is auto saved
      window.gGuide['authors'] = authors
    }
  },

  connectedCallback () {
    const vm = this

    const classChangeHandler = (mutationsList) => {
      mutationsList.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          const isActive = mutation.target.classList.value.indexOf('active') !== -1
          console.log('has `active` class', isActive)
          if (!isActive) {
            vm.saveAuthors(vm.displayList)
          }
        }
      })
    }

    const mutationObserver = new window.MutationObserver(classChangeHandler)

    const authorsEl = document.getElementById('tab-authors')
    if (authorsEl) {
      mutationObserver.observe(
        authorsEl,
        { attributes: true }
      )
    }

    return () => {
      // cleanup
      mutationObserver.disconnect()
    }
  }
})

export default Component.extend({
  tag: 'about-authors',
  view: template,
  leakScope: false,
  ViewModel: AboutAuthorsVM
})
