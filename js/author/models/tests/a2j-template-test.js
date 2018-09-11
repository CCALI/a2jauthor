import { assert } from 'chai'
import moment from 'moment'
import A2JNode from '../a2j-node'
import A2JTemplate from '../a2j-template'
import '../fixtures/templates'

import 'steal-mocha'

describe('A2JTemplate Model', function () {
  beforeEach(function () {
    localStorage.clear()
  })

  afterEach(function () {
    localStorage.clear()
  })

  it('findOne', function () {
    let promise = A2JTemplate.findOne({ guideId: 1261, templateId: 2112 })

    return promise.then(function (a2jTemplate) {
      assert.ok(a2jTemplate.attr('rootNode') instanceof A2JNode)
      assert.ok(a2jTemplate.attr('rootNode.children.0') instanceof A2JNode)
      assert.ok(a2jTemplate.attr('rootNode.children.1') instanceof A2JNode)
    })
  })

  it('findAll', function () {
    let promise = A2JTemplate.findAll({guideId: 1261})

    return promise.then(function (a2jTemplates) {
      a2jTemplates.forEach(function (a2jTemplate) {
        assert.ok(a2jTemplate.attr('rootNode') instanceof A2JNode)

        if (a2jTemplate.attr('rootNode.children.length')) {
          assert.ok(a2jTemplate.attr('rootNode.children.0') instanceof A2JNode)
        }
      })
    })
  })

  it('create', function () {
    let a2jTemplate = new A2JTemplate({title: 'Best Template'})

    return a2jTemplate.save().then(function (bestTemplate) {
      assert.equal(bestTemplate.attr('title'), 'Best Template')
    })
  })

  it('update', function (done) {
    let a2jTemplate = new A2JTemplate({title: 'Best Template'})

    a2jTemplate.save().then(function (bestTemplate) {
      assert.equal(bestTemplate.attr('title'), 'Best Template')

      let templateId = bestTemplate.attr('templateId')

      bestTemplate.attr('title', 'Bestest Template')

      bestTemplate.save().then(function (bestestTemplate) {
        assert.equal(bestestTemplate.attr('title'), 'Bestest Template')
        assert.equal(bestestTemplate.attr('templateId'), templateId)
        done()
      })
    })
  })

  it('destroy', function (done) {
    let promise = A2JTemplate.findAll({guideId: 1261})

    promise.then(function (a2jTemplates) {
      const destroyPromises = a2jTemplates.map(function (a2jTemplate) {
        if (a2jTemplate.attr('templateId') >= 3000) {
          return a2jTemplate.destroy()
        }
      })

      Promise.all(destroyPromises)
        .then(done())
    })
  })

  it('addNode', function () {
    let promise = A2JTemplate.findOne({ guideId: 1261, templateId: 2112 })

    return promise.then(function (a2jTemplate) {
      let children = a2jTemplate.attr('rootNode.children')
      let total = children.attr('length')

      a2jTemplate.addNode(null)
      assert.equal(children.attr('length'), total,
        'it does nothing when invalid node is passed')

      let newNode = new A2JNode({title: 'foo bar'})
      a2jTemplate.addNode(newNode)

      assert.equal(children.attr('length'), total + 1, 'there should be one more')
      assert.equal(children.pop().attr('title'), 'foo bar')
    })
  })

  it('search - filters list that matches title', function () {
    let result
    let templates = new A2JTemplate.List([{title: 'foo'}, {title: 'bar o'}])

    result = templates.search('baz')
    assert.equal(result.attr('length'), 0, 'no templates with baz title')

    result = templates.search('foo')
    assert.equal(result.attr('length'), 1, 'there is one match')

    result = templates.search('o')
    assert.equal(result.attr('length'), 2, 'there are two matches')
  })

  describe('outline', function () {
    it('returns fixed message when template has no elements', function () {
      const template = new A2JTemplate()
      const children = template.attr('rootNode.children')

      assert.equal(children.attr('length'), 0, 'should be blank')
      assert.equal(template.attr('outline'), 'This template is blank')
    })

    it('returns list of formatted element names (no nested elements)', function () {
      const rteAndSectionTitle = A2JTemplate.makeFromTreeObject({
        rootNode: {
          tag: 'a2j-template',
          children: [
            { tag: 'a2j-rich-text', state: {} },
            { tag: 'a2j-section-title', state: {} }
          ]
        }
      })

      const sectionTitleAndRTE = A2JTemplate.makeFromTreeObject({
        rootNode: {
          tag: 'a2j-template',
          children: [
            { tag: 'a2j-section-title', state: {} },
            { tag: 'a2j-rich-text', state: {} }
          ]
        }
      })

      assert.equal(rteAndSectionTitle.attr('outline'), 'Rich Text, Section Title')
      assert.equal(sectionTitleAndRTE.attr('outline'), 'Section Title, Rich Text')
    })

    it('repeat-loop outline is annotated with display type', function () {
      const repeatLoop = A2JTemplate.makeFromTreeObject({
        rootNode: {
          tag: 'a2j-template',
          children: [
            { tag: 'a2j-repeat-loop', state: { displayType: '' } }
          ]
        }
      })

      // defaults to table if displayType unknown
      assert.equal(repeatLoop.attr('outline'), 'Repeat Loop (Table)')

      repeatLoop.attr('rootNode.children.0.state.displayType', 'list')
      assert.equal(repeatLoop.attr('outline'), 'Repeat Loop (List)')

      repeatLoop.attr('rootNode.children.0.state.displayType', 'text')
      assert.equal(repeatLoop.attr('outline'), 'Repeat Loop (Text)')

      repeatLoop.attr('rootNode.children.0.state.displayType', 'table')
      assert.equal(repeatLoop.attr('outline'), 'Repeat Loop (Table)')
    })

    it('if-else outline is annotated with nested elements', function () {
      const ifElse = A2JTemplate.makeFromTreeObject({
        rootNode: {
          tag: 'a2j-template',
          children: [
            { tag: 'a2j-conditional',
              state: {},
              children: [
                { rootNode: {
                  tag: 'a2j-template',
                  children: [
                    { tag: 'a2j-section-title', state: {} },
                    { tag: 'a2j-repeat-loop', state: { displayType: '' } }
                  ]
                }
                },
                { rootNode: {
                  tag: 'a2j-template',
                  children: [
                    { tag: 'a2j-rich-text', state: {} },
                    { tag: 'a2j-page-break', state: {} }
                  ]
                }
                }
              ]
            }
          ]
        }
      })

      assert.equal(
        ifElse.attr('outline'),
        'If / Else (Section Title, Repeat Loop (Table), Rich Text, Page Break)'
      )
    })

    it('if-else nested elements should not output empty template message', function () {
      const ifElse = A2JTemplate.makeFromTreeObject({
        rootNode: {
          tag: 'a2j-template',
          children: [
            { tag: 'a2j-conditional',
              state: {},
              children: [
                { rootNode: {
                  tag: 'a2j-template',
                  children: [
                    { tag: 'a2j-section-title', state: {} }
                  ]
                }
                },
                { rootNode: { tag: 'a2j-template', children: [] } }
              ]
            }
          ]
        }
      })

      assert.equal(ifElse.attr('outline'), 'If / Else (Section Title)')
    })
  })

  describe('A2JTemplate.List.sortBy', function () {
    let templates

    const today = moment.utc()
    const oneDayAgo = today.subtract(1, 'days').format()
    const twoDaysAgo = today.subtract(2, 'days').format()
    const threeDaysAgo = today.subtract(3, 'days').format()

    const templatesFixture = [
      { buildOrder: 3, title: 'a-third', active: false, updatedAt: twoDaysAgo },
      { buildOrder: 2, title: 'b-second', active: true, updatedAt: threeDaysAgo },
      { buildOrder: 3, title: 'a-third', active: true, updatedAt: twoDaysAgo },
      { buildOrder: 1, title: 'c-first', active: true, updatedAt: oneDayAgo }
    ]

    const getActual = function (templates) {
      return templates.attr().map(function (tpl) {
        const { buildOrder, title, active } = tpl
        return { buildOrder, title, active }
      })
    }

    beforeEach(function () {
      templates = new A2JTemplate.List(templatesFixture)
    })

    it('buildOrder asc (actives are sorted first)', function () {
      templates.sortBy('buildOrder')

      const actual = getActual(templates)

      assert.deepEqual(actual, [
        { buildOrder: 1, title: 'c-first', active: true },
        { buildOrder: 2, title: 'b-second', active: true },
        { buildOrder: 3, title: 'a-third', active: true },
        { buildOrder: 3, title: 'a-third', active: false }
      ])
    })

    it('buildOrder desc (actives are sorted first)', function () {
      templates.sortBy('buildOrder', 'desc')

      const actual = getActual(templates)

      assert.deepEqual(actual, [
        { buildOrder: 3, title: 'a-third', active: true },
        { buildOrder: 3, title: 'a-third', active: false },
        { buildOrder: 2, title: 'b-second', active: true },
        { buildOrder: 1, title: 'c-first', active: true }
      ])
    })

    it('title asc (actives are sorted first)', function () {
      templates.sortBy('title')

      const actual = getActual(templates)

      assert.deepEqual(actual, [
        { buildOrder: 3, title: 'a-third', active: true },
        { buildOrder: 3, title: 'a-third', active: false },
        { buildOrder: 2, title: 'b-second', active: true },
        { buildOrder: 1, title: 'c-first', active: true }
      ])
    })

    it('title desc (actives are sorted first)', function () {
      templates.sortBy('title', 'desc')

      const actual = getActual(templates)

      assert.deepEqual(actual, [
        { buildOrder: 1, title: 'c-first', active: true },
        { buildOrder: 2, title: 'b-second', active: true },
        { buildOrder: 3, title: 'a-third', active: true },
        { buildOrder: 3, title: 'a-third', active: false }
      ])
    })

    it('updatedAt asc (actives are sorted first)', function () {
      templates.sortBy('updatedAt')

      const actual = getActual(templates)

      assert.deepEqual(actual, [
        { buildOrder: 1, title: 'c-first', active: true },
        { buildOrder: 3, title: 'a-third', active: true },
        { buildOrder: 3, title: 'a-third', active: false },
        { buildOrder: 2, title: 'b-second', active: true }
      ])
    })

    it('updatedAt asc (actives are sorted first)', function () {
      templates.sortBy('updatedAt', 'desc')

      const actual = getActual(templates)

      assert.deepEqual(actual, [
        { buildOrder: 2, title: 'b-second', active: true },
        { buildOrder: 3, title: 'a-third', active: true },
        { buildOrder: 3, title: 'a-third', active: false },
        { buildOrder: 1, title: 'c-first', active: true }
      ])
    })
  })
})
