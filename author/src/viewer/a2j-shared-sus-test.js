import './A2J_SharedSus'

import { assert } from 'chai'
import 'steal-mocha'

describe('src/viewer/A2J_SharedSus', function () {
  describe('REG regex object', function () {
    it('REG.LOGIC_SETTO', () => {
      // `IF` edge case test based on past issue with `Asset` https://github.com/CCALI/CAJA/pull/2633
      const ifLogicString = `IF [Asset property total NU] IS 3`
      const setLogicString = `SET [Asset property total NU] TO 14`

      const setRegEx = window.REG.LOGIC_SETTO

      const setMatches = setLogicString.match(setRegEx)
      const expectedMatches = ['SET [Asset property total NU] TO 14', '[Asset property total NU]', 'TO', '14']
      assert.deepEqual(setMatches, expectedMatches, 'should find match groups for SET logic strings')

      const ifMatches = ifLogicString.match(setRegEx)
      assert.equal(ifMatches, null, 'should not match outside of SET regex')
    })
  })
})
