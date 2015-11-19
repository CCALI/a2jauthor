import assert from 'assert';
import { ModalVM } from './modal';

describe('<a2j-modal> ViewModel', () => {
  let vm;

  beforeEach(() => {
    vm = new ModalVM();
  });

  it('currentPage', () => {
    let interview = {
      getPageByName(name){
        let pages = {
          foo: 'bar'
        };
        return pages[name];
      }
    };
    let rState = new can.Map({
      page: 'foo'
    });
    vm.attr('interview', interview);
    vm.attr('rState', rState);
    assert.equal(vm.attr('currentPage'), 'bar');
  });
});