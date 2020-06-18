import 'steal-mocha'
import { assert } from 'chai'
import { CheckmarkLoader } from './checkmark-picker'

describe('pdf/checkmark-picker', () => {
  describe('CheckmarkLoader', () => {
    it('should return the cached result', done => {
      const getChecks = CheckmarkLoader('Cake', () => {})
      getChecks().then(cachedResult => {
        assert.equal(cachedResult, 'Cake')
        done()
      }).catch(done)
    })

    it('should cache the result of getCheckmarks', done => {
      let getCount = 0
      const getChecks = CheckmarkLoader(null, function getCheck () {
        getCount += 1
        return Promise.resolve('Cake')
      })
      getChecks().then(() => {
        assert.equal(getCount, 1, 'getCheck should be called')
        return getChecks().then(checks => {
          assert.equal(getCount, 1, 'getCheck should not be called')
          assert.equal(checks, 'Cake', 'cached result should equal getCheck value')
          done()
        })
      }).catch(done)
    })
  })
})
