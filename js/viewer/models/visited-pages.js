import List from 'can/list/';
import _find from 'lodash/collection/find';
import _findIndex from 'lodash/array/findIndex';

let registerPageFromUrl = function(appState, interview) {
  let pageName = appState.attr('page');
  let visited = appState.attr('visitedPages');

  if (pageName !== '' && !visited.attr('length')) {
    let pages = interview.attr('pages');
    let page = pages.find(pageName);
    visited.push(page);
  }
};

export default function(appState, interview) {
  if (!interview || !appState) return;

  // if user is loading a specific page url, `visitedPages` will include page.
  registerPageFromUrl(appState, interview);

  appState.bind('page', function() {
    let pageName = appState.attr('page');

    if (!pageName) return;

    let visited = appState.attr('visitedPages');
    let page = interview.getPageByName(pageName);

    // do not add the same page twice.
    let alreadyVisited = _find(visited, function(visitedPage) {
      return visitedPage.attr('name') === pageName;
    });

    if (page && !alreadyVisited) visited.unshift(page);
  });
}
