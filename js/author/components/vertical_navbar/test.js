import 'steal-mocha';
import assert from 'assert';
import {VerticalNavbar} from './vertical_navbar';

describe('<vertical-navbar>', function() {

  describe('ViewModel', function() {
    var vm;

    beforeEach(function() {
      vm = new VerticalNavbar();
    });

    it('defaults \'position\' to left', function() {
      assert.equal(vm.attr('position'), 'left');
    });

    it('defaults \'theme\' to default', function() {
      assert.equal(vm.attr('theme'), 'default');
    });

    it('enforces left or right as \'position\' values', function() {
      vm.attr('position', 'foo');
      assert.equal(vm.attr('position'), 'left', 'foo is not a valid position');

      vm.attr('position', 'right');
      assert.equal(vm.attr('position'), 'right');
    });

    it('enforces default or inverse as \'theme\' values', function() {
      vm.attr('theme', 'bar');
      assert.equal(vm.attr('theme'), 'default', 'bar is not a valid theme');

      vm.attr('theme', 'inverse');
      assert.equal(vm.attr('theme'), 'inverse');
    });
  });

});
