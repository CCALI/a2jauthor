import can from 'can';
import assert from 'assert';
import Validations from 'client/util/validations';

describe('Validations', function() {
  let validations;

  beforeEach(function() {
    validations = new Validations();
  });

  it('empty config', function() {
    let invalid = validations.required()
      || validations.maxChars()
      || validations.min()
      || validations.max();

    assert.ok(!invalid, 'empty config attrs are ignored');
  });

  describe('validations:required', function() {
    beforeEach(function() {
      validations = new Validations({
        config: {
          required: true
        }
      });
    });

    it('simple', function() {
      validations.attr('val', '');
      assert.ok(validations.required(), 'val is invalid');

      validations.attr('val', 'foo');
      assert.ok(!validations.required(), 'val is valid');
    });

    it('null/undefined', function() {
      assert.ok(validations.required(), 'val is invalid');

      validations.attr('val', null);
      assert.ok(validations.required(), 'val is invalid');
    });

    it('object val', function() {
      assert.ok(validations.required(), 'val is invalid');

      validations.attr('val', {});
      assert.ok(!validations.required(), 'val is valid');
    });
  });

  describe('validations:maxChars', function() {
    beforeEach(function() {
      validations = new Validations({
        config: {
          maxChars: 1
        }
      });
    });

    it('simple', function() {
      validations.attr('val', 'f');
      assert.ok(!validations.maxChars(), 'valid');

      validations.attr('val', 'foo');
      assert.ok(validations.maxChars(), 'invalid');
    });
  });

  describe('validations:min', function() {
    beforeEach(function() {
      validations = new Validations();
    });

    it('number', function() {
      validations.attr('config.min', 10);
      validations.attr('val', 10);
      assert.ok(!validations.min(), 'valid');

      validations.attr('val', 9);
      assert.ok(validations.min(), 'invalid');
    });

    it('date:min', function() {
      validations.attr('config.type', 'datemdy');
      validations.attr('config.min', '12/01/2014');
      validations.attr('val', '2014-12-01');
      assert.ok(!validations.min(), 'valid');

      validations.attr('val', '2014-11-30');
      assert.ok(validations.min(), 'invalid');
    });

    it('date:max', function() {
      validations.attr('config.type', 'datemdy');
      validations.attr('config.max', '12/31/2014');
      validations.attr('val', '2014-12-31');
      assert.ok(!validations.max(), 'valid');

      validations.attr('val', '2015-01-01');
      assert.ok(validations.max(), 'invalid');
    });
  });

});
