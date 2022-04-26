import { AboutAuthorsVM } from './authors'
import { assert } from 'chai'
import stache from 'can-stache'
import canViewModel from 'can-view-model'
import '~/legacy/viewer/A2J_Types'

import 'steal-mocha'

describe('<about-authors>', () => {
  describe('ViewModel', () => {
    let vm
    const testAuthor = { name: 'JessBob', title: 'boss', organization: 'CALI', email: 'jb@cali.org' }

    beforeEach(() => {
      vm = new AboutAuthorsVM({
        guide: {
          authors: [testAuthor]
        }
      })
    })

    it('authorList, authorCount and workingList defaults', () => {
      const expectedWorkingList = [testAuthor]
      const authorList = vm.authorList.serialize()
      const workingList = vm.workingList.serialize()

      assert.deepEqual(workingList, expectedWorkingList, 'defaults to incoming guide.authors list')
      assert.deepEqual(authorList, workingList, 'defaults to workingList')
      assert.equal(vm.authorCount, authorList.length, 'default authorCount based on workingList.length')
    })
  })

  describe('Component', () => {
    afterEach(() => {
      document.getElementById('test-area').innerHTML = ''
    })

    it('handles dynamic workingList and authorList', () => {
      const render = (data) => {
        const tpl = stache('<about-authors guide:from="guide" />')
        document.querySelector('#test-area').appendChild(tpl(data))
        return canViewModel('about-authors')
      }

      const testAuthor = { name: 'JessBob', title: 'boss', organization: 'CALI', email: 'jb@cali.org' }
      const vm = render({ guide: { authors: [testAuthor] } })

      let expectedWorkingList = [testAuthor]
      let workingList = vm.workingList.serialize()
      let authorList

      assert.deepEqual(expectedWorkingList, workingList, 'defaults to incoming guide.authors list')

      vm.authorCount = 2
      expectedWorkingList = [
        testAuthor,
        { name: '', title: '', organization: '', email: '' }
      ]

      workingList = vm.workingList.serialize()
      authorList = vm.authorList.serialize()

      assert.deepEqual(expectedWorkingList, workingList, 'pushes new TAuthor into workingList')
      assert.deepEqual(authorList, workingList, 'authorList resolves to the new workingList on additions')

      vm.authorCount = 1
      expectedWorkingList = [
        testAuthor,
        { name: '', title: '', organization: '', email: '' }
      ]

      const expectedDisplayList = [testAuthor]

      workingList = vm.workingList.serialize()
      authorList = vm.authorList.serialize()

      assert.deepEqual(expectedWorkingList, workingList, 'pushes new TAuthor into workingList')
      assert.deepEqual(expectedDisplayList, authorList, 'authorList resolves to a slice of the workingList when shorter')
    })
  })
})
