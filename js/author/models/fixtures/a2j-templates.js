import _values from 'lodash/object/values';
import template2112 from './templates/guide1261_template2112';
import template2113 from './templates/guide1261_template2113';

let fixtureTemplates = {
  2112: template2112,
  2113: template2113
};

let a2jTemplates = JSON.parse(localStorage.getItem('a2jTemplates'));
let a2jTemplateSequence = Number(localStorage.getItem('a2jTemplateSequence'));

let persistTemplates = () => {
  localStorage.setItem('a2jTemplates', JSON.stringify(a2jTemplates));
  localStorage.setItem('a2jTemplateSequence', a2jTemplateSequence);
};

if(!a2jTemplates) {
  a2jTemplates = fixtureTemplates;
  a2jTemplateSequence = 3000;

  persistTemplates();
}

export default function(request, response) {
  let requestData = request.data || {};

  if(request.type === 'post') {
    requestData.guide_id = '1261';
    requestData.template_id = a2jTemplateSequence++;
  }

  if(request.type === 'post' || request.type === 'put') {
    a2jTemplates[requestData.template_id] = requestData;
    persistTemplates();

    return a2jTemplates[requestData.template_id];
  }
  else if(request.type === 'delete') {
    if(a2jTemplates[requestData.template_id] === undefined) {
      response(404);
    }
    else {
      delete a2jTemplates[requestData.template_id];
      persistTemplates();
      response(200);
    }
  }
  else if(requestData.template_id) {
    return a2jTemplates[requestData.template_id];
  }
  else {
    return _values(a2jTemplates);
  }
};
