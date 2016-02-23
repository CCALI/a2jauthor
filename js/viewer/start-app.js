import $ from 'jquery';
import isMobile from './is-mobile';
import template from './app.stache!';
import Lang from 'viewer/mobile/util/lang';
import Logic from 'viewer/mobile/util/logic';
import constants from 'viewer/models/constants';
import PersistedState from 'viewer/models/persisted-state';
import setMobileDesktopClass from 'viewer/util/set-mobile-desktop-class';

export default function({interview, pState, mState, rState}) {
  can.route.ready();

  pState = pState || new PersistedState();
  pState.attr('setDataURL', mState.attr('setDataURL'));
  pState.attr('autoSetDataURL', mState.attr('autoSetDataURL'));

  const lang = new Lang(interview.attr('language'));
  const answers = pState.attr('answers');

  answers.attr('lang', lang);
  answers.attr(can.extend({}, interview.serialize().vars));
  answers.attr(constants.vnInterviewIncompleteTF.toLowerCase(), {
    name: constants.vnInterviewIncompleteTF.toLowerCase(),
    type: constants.vtTF,
    values: [null, true]
  });

  interview.attr('answers', answers);

  const logic = new Logic({
    interview: interview
  });

  pState.backup();

  rState.bind('change', function(ev, attr, how, val) {
    if (attr === 'page' && val) {
      pState.attr('currentPage', val);
    }
  });

  rState.attr('interview', interview);
  setMobileDesktopClass(isMobile, $('body'));

  rState.attr('logic', logic);

  const modalContent = can.compute();

  $('#viewer-app').append(template({
    rState, pState, mState, interview, logic, lang, isMobile, modalContent
  }));
}
