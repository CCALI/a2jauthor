import template2112 from './templates/guide1261_template2112';
import template2113 from './templates/guide1261_template2113';

export default function(request) {
  let requestData = request.data || {};

  let templateMap = {
    2112: template2112,
    2113: template2113
  };

  if(requestData.template_id) {
    return templateMap[requestData.template_id];
  }
  else {
    return [ template2112, template2113 ];
  }
};
