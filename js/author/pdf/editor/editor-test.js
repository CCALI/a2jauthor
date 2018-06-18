import 'steal-mocha';
import assert from 'assert';
import { PdfEditorVm } from './editor';
import List from 'can/list/list';
import Map from 'can/map/map';

describe('PdfEditorVm', function () {

  describe('viewModel', function () {
    let vm, boxes, template;

    beforeEach(function () {
      vm = new PdfEditorVm();
      template = new Map({
        rootNode: {
          boxes: []
        }
      });
      vm.attr('template', template);

      const box1 = new Map({
        area: new Map(),
        id: 'vb-1',
        groupId: 'gp-1',
        isSelected: true,
        page: 0,
        variable: 'paragraph',
        variableValue: null
      });

      const box2 = new Map({
        area: new Map(),
        id: 'vb-2',
        groupId: 'gp-1',
        isSelected: false,
        page: 0,
        variable: 'paragraph',
        variableValue: null
      });

      boxes = new List([box1, box2]);
      vm.attr('template.rootNode.boxes', boxes);
    });

    it('adds boxes with matching groupId on single box select', function () {
      const box2 = vm.attr('boxes')[1];

      vm.relayBoxClick('vb-1', false);
      assert.equal(box2.attr('isSelected'), true, 'should update isSelected for all boxes in the group');
    });
  });

});
