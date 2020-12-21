import DefineMap from 'can-define/map/map'
import CanMap from 'can-map'
import CanList from 'can-list'
import Component from 'can-component'
import template from './authors.stache'

// app-state guide is a CanMap, which makes authorList a CanList of CanMaps
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
    default: 1
  },
  // used to maintain a list as it's being edited. could contain more than is being display
  authorList: {
    default () {
      return new DefineList(this.guide.attr('authors').serialize())
    }
  },

  // list of authors display in UI, could show less than the working list,
  // and will be saved to the guide on nav away
  displayList: {
    value ({ listenTo, resolve }) {
      resolve(this.authorList)

      listenTo('authorCount', (ev, selectedValue) => {
        const currentCount = this.authorList.length
        const diff = selectedValue - currentCount

        if (selectedValue > currentCount) {
          for (let i = 0; i < diff; i++) {
            this.authorList.push(new Author())
          }
          resolve(this.authorList)
        }
        if (currentCount > selectedValue) {
          const howMany = currentCount - selectedValue
          const newSubList = this.authorList.slice(0, howMany)
          resolve(newSubList)
        }
      })
    }
  }
})

export default Component.extend({
  tag: 'about-authors',
  view: template,
  leakScope: false,
  ViewModel: AboutAuthorsVM
})
