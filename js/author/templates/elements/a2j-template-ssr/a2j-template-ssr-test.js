import assert from 'assert';
import CanList from "can-list";
import TemplateSsrVM from './a2j-template-ssr-vm';

describe('a2j-template-srr', function() {
  describe('viewModel', function() {

    it('templatesPromise resolves a list of templates', function(done) {
      const vm = new TemplateSsrVM({ guideId: '1261', templateId: '2112' });

      vm.attr('templatesPromise').then(templates => {
        assert(templates instanceof CanList);
        done();
      });
    });
  });
});
