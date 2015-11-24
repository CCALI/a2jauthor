import fixture from 'can/util/fixture/';
import a2jTemplates from './a2j-templates';

import './guides';

fixture('GET /api/guides/{guideId}/templates', a2jTemplates);
fixture('GET /api/templates/{templateId}', a2jTemplates);
fixture('POST /api/templates', a2jTemplates);
fixture('PUT /api/templates/{templateId}', a2jTemplates);
fixture('DELETE /api/templates/{templateId}', a2jTemplates);
