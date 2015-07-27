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

  it('search - filters list that matches title', function() {
    let result;
    let templates = new Template.List([{title: 'foo'}, {title: 'bar o'}]);

    result = templates.search('baz');
    assert.equal(result.attr('length'), 0, 'no templates with baz title');

    result = templates.search('foo');
    assert.equal(result.attr('length'), 1, 'there is one match');

    result = templates.search('o');
    assert.equal(result.attr('length'), 2, 'there are two matches');
  });

});
