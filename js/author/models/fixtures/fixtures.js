import fixture from 'can/util/fixture/';
import a2jTemplates from './a2j-templates';

import './guides';
import './templates';

fixture('GET /api/guides/{guide_id}/templates', a2jTemplates);
fixture('GET /api/templates/{template_id}', a2jTemplates);
