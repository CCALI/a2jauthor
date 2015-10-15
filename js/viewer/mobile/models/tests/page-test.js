import assert from 'assert';
import Page from 'viewer/mobile/models/page';

import 'steal-mocha';

describe('Page Model', function() {

  it('find', function() {
    let page = new Page({
      name: '1-Introduction'
    });
    let pages = new Page.List();

    pages.push(page);
    assert.equal(pages.find('1-Introduction'), page, 'page found by name');
  });

});
