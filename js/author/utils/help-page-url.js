/**
 * @module {{}} author/utils/help-page-url help-page-url
 * @parent api-utils
 *
 * @option {function} pageToHelpUrl
 *
 * This function takes an string representing the `page` attribute from the
 * `appState` (an attribute bound to can.route) and generates the path to
 * the a2j author help page.
 *
 */
const basePath = 'http://author.a2jauthor.org/content/';

const pageToHelpUrlMap = {
  about: 'chapter-4-about-tab',
  variables: 'chapter-5-variables-tab',
  steps: 'chapter-6-steps-tab',
  pages: 'pages-tab',
  map: 'chapter-8-map',
  files: 'chapter-12-files-tab',
  allLogic: 'chapter-13-all-logic-tab',
  allText: 'chapter-11-all-text',
  preview: 'chapter-10-preview-mode',
  report: 'chapter-9-report-tab',
  publish: 'chapter-14-publish-tab',
  interviews: 'chapter-3-getting-started',
  templates: 'chapter-15-a2j-document-assembly-tool-a2j-dat-and-templates-tab'
};

export default function(page) {
  const urlPath = pageToHelpUrlMap[page];

  if (urlPath) {
    return basePath + urlPath;
  }
}
