import 'steal-mocha'
import { assert } from 'chai'
import assemble from './assemble'

const {
  areaComparator,
  boxComparator,
  testing: {
    getPatcher,
    getTextPatches,
    getDatePatches,
    getNumberPatches,
    getTrueFalsePatches,
    getMultipleChoicePatches
  }
} = assemble

describe('pdf/assemble', () => {
  describe('areaComparator', () => {
    it('should order top-most areas first', () => {
      const area1 = {
        top: 10,
        left: 0,
        width: 0,
        height: 0
      }

      const area2 = {
        top: 20,
        left: 0,
        width: 0,
        height: 0
      }

      const area3 = {
        top: 30,
        left: 0,
        width: 0,
        height: 0
      }

      assert.deepEqual(
        [area1, area2, area3].sort(areaComparator),
        [area1, area2, area3],
        'should maintain correct order'
      )

      assert.deepEqual(
        [area2, area3, area1].sort(areaComparator),
        [area1, area2, area3],
        'should fix order'
      )
    })

    it('should order left-most areas first', () => {
      const area1 = {
        top: 0,
        left: 10,
        width: 0,
        height: 0
      }

      const area2 = {
        top: 0,
        left: 20,
        width: 0,
        height: 0
      }

      const area3 = {
        top: 0,
        left: 30,
        width: 0,
        height: 0
      }

      assert.deepEqual(
        [area1, area2, area3].sort(areaComparator),
        [area1, area2, area3],
        'should maintain correct order'
      )

      assert.deepEqual(
        [area2, area3, area1].sort(areaComparator),
        [area1, area2, area3],
        'should fix order'
      )
    })
  })

  describe('boxComparator', () => {
    it('should order boxes on earlier pages first', () => {
      const topLeftCorner = {
        top: 0,
        left: 0,
        width: 100,
        height: 100
      }

      const box1 = {page: 0, area: topLeftCorner}
      const box2 = {page: 1, area: topLeftCorner}
      const box3 = {page: 2, area: topLeftCorner}

      assert.deepEqual(
        [box1, box2, box3].sort(boxComparator),
        [box1, box2, box3],
        'should maintain correct order'
      )

      assert.deepEqual(
        [box3, box2, box1].sort(boxComparator),
        [box1, box2, box3],
        'should fix order'
      )
    })

    it('should order boxes within the same page like area comparator', () => {
      const box1 = {
        page: 0,
        area: {
          top: 10,
          left: 10,
          width: 0,
          height: 0
        }
      }

      const box2 = {
        page: 0,
        area: {
          top: 20,
          left: 20,
          width: 0,
          height: 0
        }
      }

      const box3 = {
        page: 0,
        area: {
          top: 30,
          left: 30,
          width: 0,
          height: 0
        }
      }

      assert.deepEqual(
        [box1, box2, box3].sort(boxComparator),
        [box1, box2, box3],
        'should maintain correct order'
      )

      assert.deepEqual(
        [box3, box2, box1].sort(boxComparator),
        [box1, box2, box3],
        'should fix order'
      )
    })
  })

  describe('getPatcher', () => {
    it('should return patching functions', () => {
      assert(typeof getPatcher('text') === 'function')
      assert(typeof getPatcher('TEXT') === 'function')
      assert(typeof getPatcher('Text') === 'function')

      assert(typeof getPatcher('MC') === 'function')
      assert(typeof getPatcher('TF') === 'function')
      assert(typeof getPatcher('Date') === 'function')
      assert(typeof getPatcher('Number') === 'function')
    })
  })

  describe('getTextPatches', () => {
    const getBoxArea = () => 'GetBoxArea'
    const defaultTextOptions = 'DefaultTextOptions'
    const boxes = [{
      page: 0,
      area: {top: 0, left: 0, width: 0, height: 0}
    }, {
      page: 0,
      area: {top: 10, left: 10, width: 0, height: 0}
    }]

    describe('tables', () => {
      it('should return an array of table-text patches', () => {
        const variable = {
          repeating: true
        }
        const answer = {
          values: [null, 'ValueOne', 'ValueTwo']
        }
        const variableOptions = {
          addendumLabel: 'AddendumLabel'
        }

        const patches = getTextPatches({
          boxes,
          getBoxArea,
          variable,
          answer,
          variableOptions,
          defaultTextOptions
        })

        assert.deepEqual(patches, [{
          type: 'table-text',
          addendumLabel: 'AddendumLabel',
          addendumColumns: [],
          columns: [[{
            type: 'text',
            page: 0,
            content: 'ValueOne',
            area: 'GetBoxArea',
            text: 'DefaultTextOptions'
          }, {
            type: 'text',
            page: 0,
            content: 'ValueTwo',
            area: 'GetBoxArea',
            text: 'DefaultTextOptions'
          }]]
        }])
      })
    })

    describe('multi-line text', () => {
      it('should return an array of multiline-text patches', () => {
        const variable = {}
        const answerValue = 'Hello'
        const variableOptions = {
          overflowStyle: 'OverflowStyle',
          addendumLabel: 'AddendumLabel'
        }

        const patches = getTextPatches({
          boxes,
          getBoxArea,
          variable,
          variableOptions,
          answerValue,
          defaultTextOptions
        })

        assert.deepEqual(patches, [{
          type: 'multiline-text',
          content: 'Hello',
          overflow: {
            style: 'OverflowStyle',
            addendumLabel: 'AddendumLabel'
          },
          addendumText: defaultTextOptions,
          lines: [{
            page: 0,
            area: 'GetBoxArea',
            text: defaultTextOptions
          }, {
            page: 0,
            area: 'GetBoxArea',
            text: defaultTextOptions
          }]
        }])
      })
    })

    describe('single-line text', () => {
      it('should return an array of text patches', () => {
        const boxes = [{
          page: 1,
          area: {top: 0, left: 0, width: 0, height: 0}
        }]
        const variable = {}
        const answerValue = 'Hello'
        const patches = getTextPatches({
          boxes,
          getBoxArea,
          variable,
          variableOptions: {},
          answerValue,
          defaultTextOptions
        })

        assert.deepEqual(patches, [{
          type: 'text',
          page: 1,
          content: 'Hello',
          area: 'GetBoxArea',
          text: defaultTextOptions
        }])
      })
    })
  })

  describe('getDatePatches', () => {
    it('should return an array of text patches', () => {
      const boxes = [{
        page: 0,
        area: {top: 0, left: 0, width: 0, height: 0}
      }]
      const getBoxArea = () => 'GetBoxArea'
      const answerValue = 12
      const defaultTextOptions = 'DefaultTextOptions'
      const patches = getDatePatches({
        boxes,
        getBoxArea,
        answerValue,
        variable: {repeating: false},
        variableOptions: {},
        defaultTextOptions
      })

      assert.deepEqual(patches, [{
        type: 'text',
        page: 0,
        content: '12',
        area: 'GetBoxArea',
        text: 'DefaultTextOptions'
      }])
    })

    describe('repeating date', () => {
      it('should return an array of table-text patches', () => {
        const boxes = [{
          page: 0,
          area: {top: 0, left: 0, width: 0, height: 0}
        }, {
          page: 0,
          area: {top: 10, left: 10, width: 0, height: 0}
        }]
        const variable = {
          repeating: true
        }
        const answer = {
          values: [null, 'Monday', 'Tuesday']
        }
        const variableOptions = {
          addendumLabel: 'AddendumLabel'
        }
        const getBoxArea = () => 'GetBoxArea'
        const defaultTextOptions = 'DefaultTextOptions'

        const patches = getDatePatches({
          boxes,
          getBoxArea,
          variable,
          answer,
          variableOptions,
          defaultTextOptions
        })

        assert.deepEqual(patches, [{
          type: 'table-text',
          addendumLabel: 'AddendumLabel',
          addendumColumns: [],
          columns: [[{
            type: 'text',
            page: 0,
            content: 'Monday',
            area: 'GetBoxArea',
            text: 'DefaultTextOptions'
          }, {
            type: 'text',
            page: 0,
            content: 'Tuesday',
            area: 'GetBoxArea',
            text: 'DefaultTextOptions'
          }]]
        }])
      })
    })
  })

  describe('getNumberPatches', () => {
    it('should return an array of text patches', () => {
      const boxes = [{
        page: 0,
        area: {top: 0, left: 0, width: 0, height: 0}
      }]
      const getBoxArea = () => 'GetBoxArea'
      const answerValue = 12
      const defaultTextOptions = 'DefaultTextOptions'
      const patches = getNumberPatches({
        boxes,
        getBoxArea,
        answerValue,
        variable: {repeating: false},
        variableOptions: {},
        defaultTextOptions
      })

      assert.deepEqual(patches, [{
        type: 'text',
        page: 0,
        content: '12',
        area: 'GetBoxArea',
        text: 'DefaultTextOptions'
      }])
    })

    describe('repeating number', () => {
      it('should return an array of table-text patches', () => {
        const boxes = [{
          page: 0,
          area: {top: 0, left: 0, width: 0, height: 0}
        }, {
          page: 0,
          area: {top: 10, left: 10, width: 0, height: 0}
        }]
        const variable = {
          repeating: true
        }
        const answer = {
          values: [null, '100', '48']
        }
        const variableOptions = {
          addendumLabel: 'AddendumLabel'
        }
        const getBoxArea = () => 'GetBoxArea'
        const defaultTextOptions = 'DefaultTextOptions'

        const patches = getNumberPatches({
          boxes,
          getBoxArea,
          variable,
          answer,
          variableOptions,
          defaultTextOptions
        })

        assert.deepEqual(patches, [{
          type: 'table-text',
          addendumLabel: 'AddendumLabel',
          addendumColumns: [],
          columns: [[{
            type: 'text',
            page: 0,
            content: '100',
            area: 'GetBoxArea',
            text: 'DefaultTextOptions'
          }, {
            type: 'text',
            page: 0,
            content: '48',
            area: 'GetBoxArea',
            text: 'DefaultTextOptions'
          }]]
        }])
      })
    })
  })

  describe('getTrueFalsePatches', () => {
    it('should return an array of checkmark patches', () => {
      const boxes = [{
        page: 0,
        area: {top: 0, left: 0, width: 0, height: 0}
      }]
      const getBoxArea = () => 'GetBoxArea'
      const answerValue = true
      const variableOptions = {checkIcon: 'normal-check'}
      const patches = getTrueFalsePatches({
        boxes,
        getBoxArea,
        answerValue,
        variableOptions
      })

      assert.deepEqual(patches, [{
        type: 'checkmark',
        page: 0,
        icon: 'normal-check',
        area: 'GetBoxArea'
      }])
    })

    it('should return no patches if the answer value is false', () => {
      assert.deepEqual(getTrueFalsePatches({
        boxes: [],
        answerValue: false
      }), [])
    })

    it('should return boxes which are inverted if the answer value is false', () => {
      const boxes = [{
        page: 0,
        area: {top: 0, left: 0, width: 0, height: 0},
        isInverted: true
      }]
      const getBoxArea = () => 'GetBoxArea'
      const answerValue = false
      const variableOptions = {checkIcon: 'normal-check'}
      const patches = getTrueFalsePatches({
        boxes,
        getBoxArea,
        answerValue,
        variableOptions
      })

      assert.deepEqual(patches, [{
        type: 'checkmark',
        page: 0,
        icon: 'normal-check',
        area: 'GetBoxArea'
      }])
    })
  })

  describe('getMultipleChoicePatches', () => {
    it('should return an array of checkmark patches', () => {
      const boxes = [{
        page: 0,
        area: {top: 0, left: 0, width: 0, height: 0},
        variableValue: 'foo'
      }, {
        page: 1,
        area: {top: 0, left: 0, width: 0, height: 0},
        variableValue: 'bar'
      }]
      const getBoxArea = () => 'GetBoxArea'
      const answerValue = 'foo'
      const variableOptions = {isCheck: true, checkIcon: 'normal-check'}
      const patches = getMultipleChoicePatches({
        boxes,
        getBoxArea,
        answerValue,
        variableOptions
      })

      assert.deepEqual(patches, [{
        type: 'checkmark',
        page: 0,
        icon: 'normal-check',
        area: 'GetBoxArea'
      }])
    })
  })
})
