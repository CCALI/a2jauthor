import $ from 'jquery';
import List from 'can/list/';
import assert from 'assert';
import stache from 'can/view/stache/';
import Map from 'can/map/';
import PagesVM from './pages-vm';
import './pages';

import 'steal-mocha';

describe('<a2j-pages>', () => {
  let vm, logicStub, nextPageStub, defaults;

  beforeEach(() => {
    logicStub = new can.Map({
      exec: $.noop,
      infinite: {
        errors: $.noop,
        reset: $.noop,
        _counter: 0,
        inc: $.noop,
        reset: $.noop
      },
    });

    nextPageStub = new can.Map({
      name: 'Next',
      fields: []
    });

    defaults = {
      traceLogic: new List,
      currentPage: { fields: [] },
      logic: logicStub,
      rState: { },
      mState: { },
      interview: {
        pages: {
          find() {
            return nextPageStub;
          }
        }
      }
    };
  });

  describe('viewModel', () => {
    beforeEach(() => {
      vm = new PagesVM(defaults);
    });

    it('should set traceLogic with pageName on init', () => {
      assert.deepEqual(vm.attr('traceLogic').attr(), []);
    });

    it('navigate', () => {
      let button = new can.Map({
        label: 'Go!',
        next: 'Next'
      });

      vm.navigate(button);

      assert.deepEqual(vm.attr('traceLogic').attr(), [{
        'button': [ { msg: 'You pressed' }, { format: 'ui', msg: 'Go!' } ]
      }], 'should not run codeAfter if it is empty');

      vm.attr('currentPage.codeAfter', 'SET [Total income NU] TO 0<BR/>SET A2JInterviewVersion TO "2010-09-28"<BR/>');
      button.attr('label', 'Go Again!')
      vm.navigate(button);

      assert.deepEqual(vm.attr('traceLogic').attr(), [{
        'button': [ { msg: 'You pressed' }, { format: 'ui', msg: 'Go!' } ]
      }, {
        'button': [ { msg: 'You pressed' }, { format: 'ui', msg: 'Go Again!' } ]
      }, {
        'codeAfter': { format: 'info', msg: 'Logic After Question' }
      }], 'should run codeAfter');
    });

    it('setCurrentPage', () => {
      vm.attr('rState.page', 'foo');
      vm.setCurrentPage();

      assert.deepEqual(vm.attr('traceLogic').attr(), [{
        page: 'Next'
      }], 'trace page name');
    });
  });

  describe('Component', () => {
    beforeEach(() => {
      let frag = stache(
        '<a2j-pages></a2j-pages>'
      );
      $('#test-area').html(frag());
      vm = $('a2j-pages').viewModel();

      vm.attr(defaults);

      // prevent traceLogic changes happening in setCurrentPage
      vm.setCurrentPage = $.noop;
    });

    afterEach(() => {
      $('#test-area').empty();
    });

    describe('{rState} page', () => {
      it('default', () => {
        vm.attr('rState.page', 'foo');

        assert.deepEqual(vm.attr('traceLogic').attr(), [], 'should not run codeBefore trace if it is empty');
      });

      it('codeBefore', () => {
        nextPageStub.attr('codeBefore', 'SET [Total income NU] TO 0<BR/>SET A2JInterviewVersion TO "2010-09-28"<BR/>');
        vm.attr('rState.page', 'bar');

        assert.deepEqual(vm.attr('traceLogic').attr(), [{
          'codeBefore': { format: 'info', msg: 'Logic Before Question'}
        }], 'logic before trace');
      });

      it('Setting repeat varibale to 1', (done) => {
        vm.attr('traceLogic').bind('change', function handler() {
          vm.attr('traceLogic').unbind('change', handler);
          assert.deepEqual(vm.attr('traceLogic').attr(), [{
            'infinite-0': { msg: 'Setting repeat variable to 1'}
          }], 'Setting repeat varibale to 1');
          done();
        });

        logicStub.attr('gotoPage', 'bar');
        vm.attr('rState.page', 'foo');
      });

      it('Incrementing repeat variable', (done) => {
        vm.attr('traceLogic').bind('change', function handler() {
          vm.attr('traceLogic').unbind('change', handler);
          assert.deepEqual(vm.attr('traceLogic').attr(), [{
            'infinite-1': { msg: 'Incrementing repeat variable'}
          }], 'Incrementing repeat variable');
          done();
        });

        logicStub.attr('infinite._counter', 1);
        logicStub.attr('gotoPage', 'bar');
        vm.attr('rState.page', 'foo');
      });

      it('Possible infinte loop', (done) => {
        vm.attr('traceLogic').bind('change', function handler() {
          vm.attr('traceLogic').unbind('change', handler);
          assert.deepEqual(vm.attr('traceLogic').attr(), [{
            'infinite loop': {
              format: 'info',
              msg: 'Possible infinite loop. Too many page jumps without user interaction'
            }
          }], 'Possible infinite loop');
          done();
        });

        logicStub.attr('infinite').errors = function() { return true; };
        vm.attr('rState.page', 'foo');
      });
    });

    it('sets traceLogic when traceLogic event is triggered on the window', (done) => {
      vm.attr('traceLogic').bind('change', function handler(ev, attr) {
        vm.attr('traceLogic').unbind('change', handler);

        assert.deepEqual(vm.attr('traceLogic').attr(), [
          { error: [{ msg: 'error' }] }
        ]);

        done();
      });

      can.trigger(window, 'traceLogic', {
        error: [{ msg: 'error' }]
      }, false);
    });
  });
});
