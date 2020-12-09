import { assert } from 'chai'
import ckeArea from '../ckeditor-area'

import 'steal-mocha'

describe('ckeditor-area', function () {
  afterEach(() => {
    document.getElementById('test-area').innerHTML = ''
  })

  it('ckeArea - generate ckeditor div', function () {
    let guideNotes
    const changeHandler = (newNotes) => {
      guideNotes = newNotes
    }
    const data = {
      value: guideNotes,
      label: 'Revision Notes',
      change: changeHandler,
      name: 'about-revision-notes'
    }

    const ckeDiv = ckeArea(data)
    document.getElementById('test-area').append(ckeDiv)

    assert.equal(ckeDiv.children[0].textContent, 'Revision Notes', 'should set label attribute')
    assert.equal(ckeDiv.attributes[0].textContent, 'about-revision-notes', 'should set label attribute')

    // TODO: test for change handler to update guide?
  })
})
