import { AboutAuthorsVM } from './authors'
import { assert } from 'chai'
import stache from 'can-stache'
import canViewModel from 'can-view-model'
import '~/legacy/viewer/A2J_Types'

import 'steal-mocha'

describe('<about-authors>', () => {
  describe('ViewModel', () => {
    let vm
    let testAuthor = { name: 'JessBob', title: 'boss', organization: 'CALI', email: 'jb@cali.org' }

    beforeEach(() => {
      vm = new AboutAuthorsVM({
        guide: {
          authors: [testAuthor]
        }
      })
    })

    it('authorList, authorCount and displayList defaults', () => {
      const expectedAuthorList = [testAuthor]
      const authorList = vm.authorList.serialize()
      const displayList = vm.displayList.serialize()

      assert.deepEqual(authorList, expectedAuthorList, 'defaults to incoming guide.authors list')
      assert.deepEqual(authorList, displayList, 'defaults to authorList')
      assert.equal(vm.authorCount, authorList.length, 'default authorCount based on authorList.length')
    })
  })

  describe('Component', () => {
    afterEach(() => {
      document.getElementById('test-area').innerHTML = ''
    })

    const render = (data) => {
      const tpl = stache('<about-authors guide:from="guide" />')
      document.querySelector('#test-area').appendChild(tpl(data))
      return canViewModel('about-authors')
    }

    let testAuthor = { name: 'JessBob', title: 'boss', organization: 'CALI', email: 'jb@cali.org' }
    const vm = render({ guide: { authors: [testAuthor] } })

    it('handles dynamic authorList and displayList', () => {
      let expectedAuthorList = [testAuthor]
      let authorList = vm.authorList.serialize()
      let displayList

      assert.deepEqual(expectedAuthorList, authorList, 'defaults to incoming guide.authors list')

      vm.authorCount = 2
      expectedAuthorList = [
        testAuthor,
        { name: '', title: '', organization: '', email: '' }
      ]

      authorList = vm.authorList.serialize()
      displayList = vm.displayList.serialize()

      assert.deepEqual(expectedAuthorList, authorList, 'pushes new TAuthor into authorList')
      assert.deepEqual(displayList, authorList, 'displayList resolves to the new authorList on additions')

      vm.authorCount = 1
      expectedAuthorList = [
        testAuthor,
        { name: '', title: '', organization: '', email: '' }
      ]

      const expectedDisplayList = [testAuthor]

      authorList = vm.authorList.serialize()
      displayList = vm.displayList.serialize()

      assert.deepEqual(expectedAuthorList, authorList, 'pushes new TAuthor into authorList')
      assert.deepEqual(expectedDisplayList, displayList, 'displayList resolves to a slice of the authorList when shorter')
    })
  })
})
