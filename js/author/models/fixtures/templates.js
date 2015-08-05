import 'can/util/fixture/';
import _find from 'lodash/collection/find';
import _extend from 'lodash/object/extend';

let templates = [{
  id: 1,
  active: true,
  buildOrder: 1,
  lastModified: '2015-06-22 11:16:36',
  title: 'Authorization for Medical Treatment of a Minor',
  description: 'Magna libris iisque eu eos. Ut est simul repudiare. No eam scripta delectus definiebas, mel dolor euripidis omittantur ne, nostrum pertinax contentiones pro ne. In qui impetus nominati, eam tota discere epicurei no, cu eum omnis euripidis conclusionemque. Te quo possim feugiat, ex nam amet consul adversarium.'
}, {
  id: 3,
  active: true,
  buildOrder: 2,
  lastModified: '2015-07-22 10:16:36',
  title: 'Concerned Parties',
  description: 'Iisque ancillae pertinacia eos ex. At clita labores constituto pri, est an viderer deserunt expetenda, cu usu diam ipsum dolorum. Tale dicit sententiae vel in, eligendi assueverit eam id. Eu has tacimates lobortis postulant, ea enim eirmod sea.'
}, {
  id: 4,
  active: true,
  buildOrder: 3,
  lastModified: '2015-07-15 11:16:36',
  title: 'General Counsel Opening Statement',
  description: 'Duo ut malis intellegam. Habeo tincidunt reprimique vix ut. No eum eruditi nostrum disputationi. Clita virtute scriptorem an vix, eu cum veniam utroque gubergren. Velit disputando ei ius, putent sanctus intellegebat ut qui. Novum exerci constituto ei vel, ne munere tractatos vix.'
}, {
  id: 7,
  active: true,
  buildOrder: 4,
  lastModified: '2015-04-22 11:16:36',
  title: 'Appendix 1',
  description: 'Ut cum cibo scriptorem. Te sit vivendum convenire interpretaris, sed eu cibo virtute scribentur. Dicunt commune comprehensam est ea, an nec error omittantur. His fabulas voluptaria appellantur te.'
}, {
  id: 2,
  active: false,
  buildOrder: 1,
  lastModified: '2015-03-22 11:16:36',
  title: 'Letters of horning',
  description: 'No eam scripta delectus definiebas, mel dolor euripidis omittantur ne, nostrum pertinax contentiones pro ne. In qui impetus nominati, eam tota discere epicurei no, cu eum omnis euripidis conclusionemque. Te quo possim feugiat, ex nam amet consul adversarium.'
}, {
  id: 5,
  active: false,
  buildOrder: 3,
  lastModified: '2015-03-22 11:16:36',
  title: 'Appendix 1.1',
  description: 'Te sit vivendum convenire interpretaris, sed eu cibo virtute scribentur. Dicunt commune comprehensam est ea, an nec error omittantur. His fabulas voluptaria appellantur te.'
}, {
  id: 6,
  active: false,
  buildOrder: 3,
  lastModified: '2015-03-22 11:16:36',
  title: 'Table of authorities',
  description: 'Habeo tincidunt reprimique vix ut. No eum eruditi nostrum disputationi. Clita virtute scriptorem an vix, eu cum veniam utroque gubergren. Velit disputando ei ius, putent sanctus intellegebat ut qui. Novum exerci constituto ei vel, ne munere tractatos vix.'
}];

export default can.fixture({
  'GET /templates': function(req, res) {
    res(templates.reverse());
  },

  'GET /templates/:id': function(req, res) {
    let id = req.data.id;
    let template = _find(templates, {id});

    res(_extend({}, template, {
      elements: []
    }));
  }
});
