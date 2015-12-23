import _values from 'lodash/object/values';
import template2112 from './templates/guide1261-template2112';
import template2113 from './templates/guide1261-template2113';
import template2114 from './templates/guide20-template2114';

let fixtureTemplates = {
  2112: template2112,
  2113: template2113,
  2114: template2114
};

let a2jTemplates = JSON.parse(localStorage.getItem('a2jTemplates'));
let a2jTemplateSequence = Number(localStorage.getItem('a2jTemplateSequence'));

let persistTemplates = () => {
  localStorage.setItem('a2jTemplates', JSON.stringify(a2jTemplates));
  localStorage.setItem('a2jTemplateSequence', a2jTemplateSequence);
};

if (!a2jTemplates) {
  a2jTemplates = fixtureTemplates;
  a2jTemplateSequence = 3000;

  persistTemplates();
}

export default function(request, response) {
  let requestData = request.data || {};

  if (request.type === 'post') {
    requestData.guideId = '1261';
    requestData.templateId = a2jTemplateSequence + 1;
  }

  switch (request.type) {
    case 'put':
    case 'post':
      a2jTemplates[requestData.templateId] = requestData;
      persistTemplates();
      response(a2jTemplates[requestData.templateId]);
      break;

    case 'delete':
      if (a2jTemplates[requestData.templateId] == null) {
        response(404);
      } else {
        delete a2jTemplates[requestData.templateId];
        persistTemplates();
        response(200);
      }

      break;

    default:
      if (requestData.templateId) {
        response(a2jTemplates[requestData.templateId]);
      } else {
        response(_values(a2jTemplates));
      }
  }
}
