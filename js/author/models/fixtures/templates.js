import 'can/util/fixture/';

export default can.fixture('GET /templates', function(req, res) {

  let templates = [{
    active: true,
    buildOrder: 1,
    lastModified: '2015-06-22 11:16:36',
    title: 'Authorization for Medical Treatment of a Minor',
    description: 'Magna libris iisque eu eos. Ut est simul repudiare. No eam scripta delectus definiebas, mel dolor euripidis omittantur ne, nostrum pertinax contentiones pro ne. In qui impetus nominati, eam tota discere epicurei no, cu eum omnis euripidis conclusionemque. Te quo possim feugiat, ex nam amet consul adversarium.'
  }, {
    active: true,
    buildOrder: 2,
    lastModified: '2015-07-22 10:16:36',
    title: 'Concerned Parties',
    description: 'Iisque ancillae pertinacia eos ex. At clita labores constituto pri, est an viderer deserunt expetenda, cu usu diam ipsum dolorum. Tale dicit sententiae vel in, eligendi assueverit eam id. Eu has tacimates lobortis postulant, ea enim eirmod sea.'
  }, {
    active: true,
    buildOrder: 3,
    lastModified: '2015-07-15 11:16:36',
    title: 'General Counsel Opening Statement',
    description: 'Duo ut malis intellegam. Habeo tincidunt reprimique vix ut. No eum eruditi nostrum disputationi. Clita virtute scriptorem an vix, eu cum veniam utroque gubergren. Velit disputando ei ius, putent sanctus intellegebat ut qui. Novum exerci constituto ei vel, ne munere tractatos vix.'
  }, {
    active: true,
    buildOrder: 4,
    lastModified: '2015-04-22 11:16:36',
    title: 'Appendix 1',
    description: 'Ut cum cibo scriptorem. Te sit vivendum convenire interpretaris, sed eu cibo virtute scribentur. Dicunt commune comprehensam est ea, an nec error omittantur. His fabulas voluptaria appellantur te.'
  }];

  res(templates.reverse());
});
