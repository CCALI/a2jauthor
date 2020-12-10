import DefineMap from 'can-define/map/map'
import DefineList from 'can-define/list/list'
import Component from 'can-component'
import template from './authors.stache'

const Author = DefineMap.extend('Author', {
  name: { default: 'Anonymous' },
  title: { default: '' },
  organization: { default: '' },
  email: { default: '' }
})

Author.List = DefineList.extend('AuthorList', {
  '#': Author
})

export const AboutAuthorsVM = DefineMap.extend('AboutAuthorsVM', {
  // passed in via about.stache
  guide: {},

  authorCount: {
    get () {
      return this.displayList && this.displayList.length
    }
  },
  authorList: {
    get () {
      return this.guide.attr('authors')
    }
  },

  displayList: {
    default: function () {
      const authorList = this.guide.attr('authors')
      return new DefineList(authorList)
    }
  },

  updateDisplayList (selectedValue) {
    const currentCount = this.authorCount
    const newCount = parseInt(selectedValue, 10)

    const diff = newCount - currentCount
    if (currentCount > newCount) {
      this.removeAuthors(diff)
    }
    if (newCount > currentCount) {
      this.addAuthors(diff)
    }
  },

  addAuthors (add) {
    for (let i = 0; i < add; i++) {
      this.displayList.push(new window.TAuthor())
    }
  },

  // remove is a negative number
  removeAuthors (remove) {
    this.displayList.splice(remove)
  }
})

export default Component.extend({
  tag: 'about-authors',
  view: template,
  leakScope: false,
  ViewModel: AboutAuthorsVM
})
