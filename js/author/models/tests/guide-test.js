import assert from 'assert';
import Guide from '../guide';

import 'steal-mocha';

describe('Guide Model', () => {

  it('retrieves a list of guides properly', () => {
    return Guide.findAll().then((guides) => {
      assert(guides.attr('length') > 0);

      let guide = guides.attr(0).attr();

      assert.property(guide, 'id');
      assert.property(guide, 'title');
      assert.deepProperty(guide, 'details.size');
    });
  });

  it('retrieves list of guides that belong to user', () => {
    return Guide.findAll().then((guides) => {
      let owned = guides.owned();

      assert.isTrue(owned.attr(0).attr('owned'));
      assert.equal(owned.attr('length'), 1,
        'there is only 1 owned guide in fixtures');
    });
  });

  it('retrieves list of sample guides', () => {
    return Guide.findAll().then((guides) => {
      let samples = guides.samples();

      assert.isFalse(samples.attr(0).attr('owned'));
      assert.equal(samples.attr('length'), guides.attr('length') - 1);
    });
  });

});
