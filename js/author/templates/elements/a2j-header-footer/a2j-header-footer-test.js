import assert from 'assert';
import sinon from 'sinon';
import { HeaderFooterVM } from './a2j-header-footer';

describe('<a2j-header-footer>', function() {
  describe('viewModel', function() {
    let vm, templateSaveSpy;

    beforeEach(function() {
      templateSaveSpy = sinon.spy();
      vm = new HeaderFooterVM({
        saveTemplate: templateSaveSpy
      });
    });

    it('containsWords', () => {
      vm.attr('userContent', '');
      assert(!vm.attr('containsWords'), 'should be false if userContent is empty');

      vm.attr('userContent', '<div>Hello</div>');
      assert(vm.attr('containsWords'), 'should be true if userContent contains div with text');

      vm.attr('userContent', '<div></div>');
      assert(!vm.attr('containsWords'), 'should be false if userContent contains div without text');

      vm.attr('userContent', '<div><p>Hello</p></div>');
      assert(vm.attr('containsWords'), 'should be true if userContent contains html with text');

      vm.attr('userContent', '<div><p></p></div>');
      assert(!vm.attr('containsWords'), 'should be false if userContent contains html without text');

      vm.attr('userContent', '<div><p></p></div><p>Hello</p>');
      assert(vm.attr('containsWords'), 'should be true if userContent contains html without text and html with text');
    });

    it('setEditActive', () => {
      assert(!vm.attr('editActive'), 'editActive should be false');

      vm.setEditActive(true);
      assert(vm.attr('editActive'), 'should set editActive to true');

      vm.setEditActive(false);
      assert(!vm.attr('editActive'), 'should set editActive to false');
      assert(templateSaveSpy.calledOnce, 'should save template');
    });
  });
});
