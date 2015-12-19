import assert from 'assert';
import Guide from '../guide';

import 'steal-mocha';

describe('Guide Model', () => {

  it('retrieves a list of guides properly', function() {
    return Guide.findAll().then(function(guides) {
      assert(guides.attr('length') > 0);

      let guide = guides.attr(0).attr();

      assert.property(guide, 'id');
      assert.property(guide, 'title');
      assert.deepProperty(guide, 'details.size');
    });
  });

  it('retrieves list of guides that belong to user', function() {
    return Guide.findAll().then(function(guides) {
      let owned = guides.owned();

      assert.isTrue(owned.attr(0).attr('owned'));
      assert.equal(owned.attr('length'), 2,
        'there are 2 owned guides in the fixtures');
    });
  });

  it('retrieves list of sample guides', function() {
    return Guide.findAll().then(function(guides) {
      let samples = guides.samples();

      assert.isFalse(samples.attr(0).attr('owned'));
      assert.equal(samples.attr('length'), 4);
    });
  });

});
