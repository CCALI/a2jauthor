import { assert } from 'chai'
import { VariableEditorVM } from './editor'
import { findVarUsage } from './util/findVarUsage'
import { testPages, expectedGreedyHtml, expectedExplicitHtml } from './util/testPages'

import 'steal-mocha'

describe('<editor>', () => {
  describe('viewModel', () => {
    let vm

    beforeEach(() => {
      vm = new VariableEditorVM()
    })
    it('smoke test', () => {
      assert.equal(vm.initialVariable, undefined, 'should start with no initial variable')
    })
  })

  describe('findVarUsage', () => {
    it.only('gathers Greedy variable usage based on case insensitive variable name, aka "foo" and "foo123".', function () {
      const { pageCount, html } = findVarUsage('Foo', testPages)

      assert.equal(pageCount, 3, 'should return pageCount for variable usage across pages, fields, macros, buttons, and logic')
      assert.equal(html, expectedGreedyHtml, 'should return html message for found locations')
    })

    it('gathers Explicit variable usage based on case insensitive variable name, aka just "foo".', function () {
      const { pageCount, html } = findVarUsage('Foo', testPages)

      assert.equal(pageCount, 2, 'should return pageCount for variable usage across pages, fields, macros, buttons, and logic')
      assert.equal(html, expectedExplicitHtml, 'should return html message for found locations')
    })
  })
})
