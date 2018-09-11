import { DebugPanelVM } from './debug-panel'
import { assert } from 'chai'

import 'steal-mocha'

describe('<author-debug-panel>', () => {
  let vm

  describe('viewModel', () => {
    beforeEach(() => {
      vm = new DebugPanelVM()
    })

    it('traceLogic', () => {
      vm.attr('traceLogic').push({
        page: '1 - Intro'
      })
      vm.attr('traceLogic').push({
        button: [ { msg: 'You pressed' }, { format: 'ui', msg: 'Go!' } ]
      })
      vm.attr('traceLogic').push({
        page: '2 - Questions'
      })
      vm.attr('traceLogic').push({
        'first name': [ { format: 'var', msg: 'first name' }, { msg: ' = ' }, { format: 'val', msg: 'sam' } ]
      })
      vm.attr('traceLogic').push({
        codeAfter: { format: 'info', msg: 'Logic After Question' }
      })

      assert.deepEqual(vm.attr('traceLogicList').attr(), [
        {
          pageName: '1 - Intro',
          messages: [ {
            key: 'button',
            fragments: [ { msg: 'You pressed' }, { format: 'ui', msg: 'Go!' } ]
          } ]
        }, {
          pageName: '2 - Questions',
          messages: [ {
            key: 'first name',
            fragments: [ { format: 'var', msg: 'first name' }, { msg: ' = ' }, { format: 'val', msg: 'sam' } ]
          }, {
            key: 'codeAfter',
            fragments: [ { format: 'info', msg: 'Logic After Question' } ]
          } ]
        }
      ], 'should list basic pages and messages')

      vm.attr('traceLogic').push({
        'first name': [ { format: 'var', msg: 'first name' }, { msg: ' = ' }, { format: 'val', msg: 'manuel' } ]
      })

      assert.deepEqual(vm.attr('traceLogicList').attr(), [
        {
          pageName: '1 - Intro',
          messages: [ {
            key: 'button',
            fragments: [ { msg: 'You pressed' }, { format: 'ui', msg: 'Go!' } ]
          } ]
        }, {
          pageName: '2 - Questions',
          messages: [ {
            key: 'first name',
            fragments: [ { format: 'var', msg: 'first name' }, { msg: ' = ' }, { format: 'val', msg: 'manuel' } ]
          }, {
            key: 'codeAfter',
            fragments: [ { format: 'info', msg: 'Logic After Question' } ]
          } ]
        }
      ], 'should be able to overwrite a previous message')

      vm.attr('traceLogic').push({
        page: '3 - Loop'
      })
      vm.attr('traceLogic').push({
        codeBefore: { format: 'info', msg: 'Logic Before Question' }
      })
      vm.attr('traceLogic').push({
        'infinite-1': { msg: 'Incrementing repeat variable' }
      })
      vm.attr('traceLogic').push({
        page: '4 - Loop'
      })
      vm.attr('traceLogic').push({
        codeBefore: { format: 'info', msg: 'Logic Before Question' }
      })
      vm.attr('traceLogic').push({
        'infinite-2': { msg: 'Incrementing repeat variable' }
      })
      vm.attr('traceLogic').push({
        page: '3 - Loop'
      })
      vm.attr('traceLogic').push({
        codeBefore: { format: 'info', msg: 'Logic Before Question' }
      })
      vm.attr('traceLogic').push({
        'infinite-3': { msg: 'Incrementing repeat variable' }
      })
      vm.attr('traceLogic').push({
        page: '4 - Loop'
      })
      vm.attr('traceLogic').push({
        codeBefore: { format: 'info', msg: 'Logic Before Question' }
      })
      vm.attr('traceLogic').push({
        'infinite-4': { msg: 'Incrementing repeat variable' }
      })

      assert.deepEqual(vm.attr('traceLogicList').attr(), [
        {
          pageName: '1 - Intro',
          messages: [ {
            key: 'button',
            fragments: [ { msg: 'You pressed' }, { format: 'ui', msg: 'Go!' } ]
          } ]
        }, {
          pageName: '2 - Questions',
          messages: [ {
            key: 'first name',
            fragments: [ { format: 'var', msg: 'first name' }, { msg: ' = ' }, { format: 'val', msg: 'manuel' } ]
          }, {
            key: 'codeAfter',
            fragments: [ { format: 'info', msg: 'Logic After Question' } ]
          } ]
        },
        {
          pageName: '3 - Loop',
          messages: [{
            key: 'codeBefore',
            fragments: [ { format: 'info', msg: 'Logic Before Question' } ]
          }, {
            key: 'infinite-1',
            fragments: [ { msg: 'Incrementing repeat variable' } ]
          }]
        },
        {
          pageName: '4 - Loop',
          messages: [{
            key: 'codeBefore',
            fragments: [ { format: 'info', msg: 'Logic Before Question' } ]
          }, {
            key: 'infinite-2',
            fragments: [ { msg: 'Incrementing repeat variable' } ]
          }, {
            key: 'infinite-3',
            fragments: [ { msg: 'Incrementing repeat variable' } ]
          }, {
            key: 'infinite-4',
            fragments: [ { msg: 'Incrementing repeat variable' } ]
          }]
        }
      ], 'should handle loops')

      vm.clearTraceLogicList()
      assert.deepEqual(vm.attr('traceLogicList').attr(), [
        {
          pageName: '4 - Loop',
          messages: []
        }
      ], 'should clear messages but keep current page')

      vm.attr('traceLogic').push({
        'infinite-5': { msg: 'Incrementing repeat variable' }
      })

      assert.deepEqual(vm.attr('traceLogicList').attr(), [
        {
          pageName: '4 - Loop',
          messages: [{
            key: 'infinite-5',
            fragments: [ { msg: 'Incrementing repeat variable' } ]
          }]
        }
      ], 'should list messages pushed after list was cleared')
    })
  })
})
