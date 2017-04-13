import $ from 'jquery';
import can from 'can';
import assert from 'assert';
import PagesVM from './pages-vm';
import sinon from 'sinon';
import AppState from 'viewer/models/app-state';
import './pages';
import 'steal-mocha';

describe('<a2j-pages>', () => {
  let vm;
  let logicStub;
  let nextPageStub;
  let defaults;

  beforeEach(() => {
    logicStub = new can.Map({
      exec: $.noop,
      infinite: {
        errors: $.noop,
        reset: $.noop,
        _counter: 0,
        inc: $.noop
      },
      goToPage: false,
      varExists: sinon.spy(),
      varCreate: sinon.spy(),
      varGet: sinon.stub(),
      varSet: sinon.spy()
    });

    nextPageStub = new can.Map({
      name: 'Next',
      fields: []
    });

    defaults = {
      traceLogic: new can.List(),
      currentPage: new can.Map ({ fields: [], repeatVar: "" }),
      logic: logicStub,
      rState: new AppState(),
      mState: { },
      interview: {
        answers: new can.Map(),
        getPageByName: function() {
          return nextPageStub;
        },
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

    describe('navigate', () => {
      let setRepeatVariableStub;

      beforeEach(() => {
        setRepeatVariableStub = sinon.stub(vm, 'setRepeatVariable');
      });

      afterEach(() => {
        setRepeatVariableStub.restore();
      });

      it('without repeatVar logic', () => {
        const button = new can.Map({
          label: 'Go!',
          next: 'Next'
        });

        vm.navigate(button);

        let expectedTrageLogic = [
          { button: [{ msg: 'You pressed' }, { format: 'ui', msg: 'Go!' }] }
        ];

        assert.deepEqual(vm.attr('traceLogic').attr(), expectedTrageLogic,
          'should not run codeAfter if it is empty');

        assert.equal(setRepeatVariableStub.callCount, 0,
          'should not call setRepeatVariable');

        vm.attr('currentPage.codeAfter', 'SET [Total income NU] TO 0<BR/>SET A2JInterviewVersion TO "2010-09-28"<BR/>');
        button.attr('label', 'Go Again!');
        vm.navigate(button);

        expectedTrageLogic = [
          { button: [{ msg: 'You pressed' }, { format: 'ui', msg: 'Go!' }] },
          { button: [{ msg: 'You pressed' }, { format: 'ui', msg: 'Go Again!' }] },
          { codeAfter: { format: 'info', msg: 'Logic After Question' } }
        ];

        assert.deepEqual(vm.attr('traceLogic').attr(), expectedTrageLogic,
          'should run codeAfter');
      });

      it('with repeatVar logic', () => {
        const button = new can.Map({
          label: 'Go!',
          next: 'Next',
          repeatVar: 'Repeat',
          repeatVarSet: '=1'
        });

        vm.navigate(button);

        let expectedTrageLogic = [
          { button: [{ msg: 'You pressed' }, { format: 'ui', msg: 'Go!' }] }
        ];

        assert.deepEqual(vm.attr('traceLogic').attr(), expectedTrageLogic,
          'should not run codeAfter if it is empty');

        assert.equal(setRepeatVariableStub.callCount, 1,
          'should call setRepeatVariable');
        assert.equal(setRepeatVariableStub.firstCall.args[0], 'Repeat',
          'should call setRepeatVariable with correct repeatVar');
        assert.equal(setRepeatVariableStub.firstCall.args[1], '=1',
          'should call setRepeatVariable with correct repeatVarSet');

        vm.attr('currentPage.codeAfter', 'SET [Total income NU] TO 0<BR/>SET A2JInterviewVersion TO "2010-09-28"<BR/>');
        button.attr('label', 'Go Again!');
        vm.navigate(button);

        expectedTrageLogic = [
          { button: [{ msg: 'You pressed' }, { format: 'ui', msg: 'Go!' }] },
          { button: [{ msg: 'You pressed' }, { format: 'ui', msg: 'Go Again!' }] },
          { codeAfter: { format: 'info', msg: 'Logic After Question' } }
        ];

        assert.deepEqual(vm.attr('traceLogic').attr(), expectedTrageLogic,
          'should run codeAfter');
      });

      it('saves answer when button has a value', () => {
        let answers = defaults.interview.answers;

        let kidstf = new can.Map({
          comment: "",
          name: "KidsTF",
          repeating: true,
          type: "TF",
          values: [null]
        });

        answers.attr('kidstf', kidstf);

        const button = new can.Map({
          label: 'Go!',
          next: 'Next',
          name: 'KidsTF',
          value: "true"
        });

        vm.navigate(button);

        assert.deepEqual(answers.attr('kidstf.values.1'), true,
        'first saved value should be true');
      });

      it('saves answer when button can hold mutilple values', () => {
        let answers = defaults.interview.answers;
        let page = defaults.currentPage;

        let agesnu = new can.Map({
          comment: "",
          name: "AgesNU",
          repeating: true,
          type: "Number",
          values: [null, 14, 12]
        });

        answers.attr('agesnu', agesnu);

        const button = new can.Map({
          label: 'Go!',
          next: 'Next',
          name: 'AgesNU',
          value: "42"
        });

        // required to trigger mutli-value save
        page.attr('repeatVar', 'AgeCount');
        logicStub.varGet.returns(3);

        vm.navigate(button);

        assert.deepEqual(answers.attr('agesnu.values.3'), 42,
        'adds mutli value to index 3');
      });

    });

    it('setRepeatVariable', () => {
      vm.setRepeatVariable('Repeat', '=1');

      assert(logicStub.varExists.calledWith('Repeat'), 'Checks if repeatVar exists');
      assert(logicStub.varCreate.calledWith('Repeat', 'Number', false, 'Repeat variable index'), 'Creates repeatVar');
      assert(logicStub.varSet.calledWith('Repeat', 1), 'Sets repeatVar to 1');

      assert.deepEqual(vm.attr('traceLogic').attr(), [{
        'Repeat-0': { msg: 'Setting [Repeat] to 1' }
      }], 'Should log repeatVar initialization');

      logicStub.varGet.returns(1);
      vm.setRepeatVariable('Repeat', '+=1');

      assert(logicStub.varGet.calledWith('Repeat'), 'Gets current value of variable');
      assert(logicStub.varSet.calledWith('Repeat', 2), 'Sets repeatVar to 2');

      assert.deepEqual(vm.attr('traceLogic').attr(), [{
        'Repeat-0': { msg: 'Setting [Repeat] to 1' }
      }, {
        'Repeat-1': { msg: 'Incrementing [Repeat] to 2' }
      }], 'Should log repeatVar increment');
    });

    it('setCurrentPage', () => {
      vm.attr('rState.page', 'foo');
      vm.setCurrentPage();

      assert.deepEqual(vm.attr('traceLogic').attr(), [{
        page: 'Next'
      }], 'trace page name');
    });

    describe('default values', () => {
      it('sets default value', () => {
        let field = new can.Map({
          name: 'StateTE',
          label: 'Enter State:',
          type: 'text',
          value: 'Texas'
        });

        let answerVar = new can.Map({
          name: 'statete',
          type: 'text',
          values: [null]
        });

        vm.attr('interview.answers.statete', answerVar);

        nextPageStub.fields.push(field);
        vm.attr('rState.page', 'Next');  // page find() always returns nextPageStub

        vm.setCurrentPage();

        assert.equal(vm.attr('interview.answers.statete.values.1'), 'Texas', 'Default values override empty answers');
      });

      it('ignores default value if previous answer exists', () => {
        let field = new can.Map({
          name: 'StateTE',
          label: 'Enter State:',
          type: 'text',
          value: 'Texas'
        });

        let answerVar = new can.Map({
          name: 'statete',
          type: 'text',
          values: [null, 'Illinois']
        });

        vm.attr('interview.answers.statete', answerVar);

        nextPageStub.fields.push(field);
        vm.attr('rState.page', 'Next');  // page find() always returns nextPageStub

        vm.setCurrentPage();

        assert.equal(vm.attr('interview.answers.statete.values.1'), 'Illinois', 'Saved answers trump Default Values');
      });
    });

    });



  describe('Component', () => {
    beforeEach(() => {
      let frag = can.stache(
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
        vm.attr('rState.logic', defaults.logic);
        vm.attr('rState.interview', defaults.interview);
        vm.attr('rState.page', 'bar');
        assert.deepEqual(vm.attr('rState.traceLogic').attr(), [{page: 'Next'}, {
          'codeBefore': { format: 'info', msg: 'Logic Before Question'}
        }], 'logic before trace');
      });

      it('codeBefore with forceNavigation: true should not execute codeBefore', () => {
        nextPageStub.attr('codeBefore', 'SET [Total income NU] TO 0<BR/>SET A2JInterviewVersion TO "2010-09-28"<BR/>');
        vm.attr('rState.forceNavigation', true);
        vm.attr('rState.page', 'bar');

        assert.deepEqual(vm.attr('traceLogic').attr(), [], 'logic before trace with forceNavigation true');
      });

      it('Possible infinite loop', (done) => {
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

      vm.attr('traceLogic').bind('change', function handler() {
        vm.attr('traceLogic').unbind('change', handler);

        assert.deepEqual(vm.attr('traceLogic').attr(), [
          { error: [{ msg: 'error' }] }
        ]);

        done();
      });

      window.can.trigger(window, 'traceLogic', {
        error: [{ msg: 'error' }]
      }, false);
    });
  });
});
