import assert from 'assert';
import { SignTextVM } from './sign-text';
import Map from 'can/map/';

describe('<a2j-viewer-sign-text> ViewModel', () => {
  let vm;
  let interview;
  let answers;

  beforeEach(() => {
    vm = new SignTextVM();
    answers = new Map({
      'a2j step 0': {
        name: 'A2J Step 0',
        values: [null]
      }
    });
    interview = new Map({'answers': answers});
    vm.attr('interview', interview);
    vm.attr({'number': 0, 'text': 'Original Sign Text'});
  });

  it('overrides displayText', () => {
    let stepToUpdate = vm.attr('interview.answers.a2j step 0');
    stepToUpdate.attr('values.1', 'New Sign Text');
    assert.equal(vm.attr('displayText'), 'New Sign Text', 'Authors can set new sign displayText');
  });

  it('Returns orignal step text', () => {
    let stepToUpdate = vm.attr('interview.answers.a2j step 0');
    stepToUpdate.attr('values.1', 'New Sign Text');
    stepToUpdate.attr('values.1', '');

    assert.equal(vm.attr('displayText'), 'Original Sign Text', 'should restore text when step var set to empty string');
  });

  it('displayText', () => {
    assert.equal(vm.attr('displayText'), 'Original Sign Text', 'should not change short text');

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
