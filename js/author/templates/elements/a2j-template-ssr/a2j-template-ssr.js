import Component from "can-component";
import template from './a2j-template-ssr.stache!';
import TemplateSsrVM from './a2j-template-ssr-vm';

/**
 * @module {Module} A2JTemplateSsr
 * @parent api-components
 *
 * This component is used server side, to wrap `<a2j-template>`, it retrieves the
 * template(s) needed to generate the document and parses the answers object coming
 * from the client.
 *
 * ## Use
 *
 * @codestart
 *   <a2j-template-wrapper
 *     {answers}="request.body.answers"
 *     {guide-id}="request.body.guideId"
 *     {template-id}="request.body.templateId"
 *   />
 * @codeend
 */
export default Component.extend({
 view: template,
 tag: 'a2j-template-ssr',
 ViewModel: TemplateSsrVM,
 leakScope: false
});
