import moment from 'moment';
import assert from 'assert';
import {default as Template, lastModifiedFormat} from '../template';

import 'steal-mocha';

describe('Template model', function() {

  it('lastModifiedFromNow - returns relative time string', function() {
    let template = new Template({lastModified: null});
    let fromNow = template.attr('lastModifiedFromNow');

    assert.isString(fromNow, 'should be a string');
    assert.equal(fromNow, '', 'should be empty since date is invalid');

    let oneDayAgo = moment().subtract(1, 'days').format(lastModifiedFormat);

    template.attr('lastModified', oneDayAgo);
    fromNow = template.attr('lastModifiedFromNow');
    assert.equal(fromNow, 'a day ago');
  });

  it('list of templates is sorted by buildOrder asc', function() {
    return Template.findAll().then(function(templates) {
      let orderSeq = templates.attr().map(template => template.buildOrder);
      assert.deepEqual(orderSeq, [1, 2, 3, 4]);
    });
  });

});
