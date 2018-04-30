import fixture from 'can/util/fixture/';
import a2jTemplates from './a2j-templates';

fixture('GET /api/templates/{guideId}', a2jTemplates);
fixture('GET /api/template/{guideId}-{templateId}', a2jTemplates);
fixture('POST /api/template', a2jTemplates);
fixture('PUT /api/template/{guideId}-{templateId}', a2jTemplates);
fixture('DELETE /api/template/{guideId}-{templateId}', a2jTemplates);
