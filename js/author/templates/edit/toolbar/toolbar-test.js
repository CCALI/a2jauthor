import assert from 'assert';
import sinon from 'sinon';

import { EditToolbarVM } from './toolbar';

describe('<template-edit-toolbar>', function() {
  describe('ViewModel', function() {
    let vm, saveTemplateSpy;

    beforeEach(function() {
      saveTemplateSpy = sinon.spy();

      vm = new EditToolbarVM({
        template: {
          save: saveTemplateSpy
        }
      });
    });

    it('saveTemplate', function() {
      vm.saveTemplate();
      assert(saveTemplateSpy.calledOnce, 'should call template.save');
    });
  });
});
