import assert from 'assert';
import { SignTextVM } from './sign-text';

describe('<a2j-viewer-sign-text> ViewModel', () => {
  let vm;

  beforeEach(() => {
    vm = new SignTextVM();
  });

  it('displayText', () => {
    vm.attr('text', 'some short text');
    assert.equal(vm.attr('displayText'), 'some short text', 'should not change short text');

    vm.attr('text', 'slightly longer text with a space as the 51st char that gets truncated');
    assert.equal(
      vm.attr('displayText'),
      'slightly longer text with a space as the 51st char...',
      'should truncate to 50 chars and add an ellipsis'
    );

    vm.attr('text', 'long text with a space as the 50th character in the middle of a word');
    assert.equal(
      vm.attr('displayText'),
      'long text with a space as the 50th character in...',
      'should truncate to last full word before 50th char and add an ellipsis'
    );

    vm.attr('maxChars', 6);
    assert.equal(vm.attr('displayText'), 'long...', 'maxChars should be configurable');

    vm.attr('overflowText', '[...]');
    assert.equal(vm.attr('displayText'), 'long[...]', 'overflowText should be configurable');
  });
});
