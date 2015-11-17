export default {
  // templateURL points to the interview XML. This demo just passes what's on the querystring.
  // templateURL:'../tests/data/Sample Short Interview Answers.anx?data=something',
  templateURL: '../tests/data/All-Inclusive Sample Interview.json',
  templateURL: '../tests/data/Fields And Logic Repeat Loops.json',
  templateURL: '../tests/data/Mobile Volunteer answers.json',
  templateURL: '../tests/data/A2J_NYSample_interview.json',
  templateURL: '../tests/data/A2J_MobileOnlineInterview_Interview.json',
  //templateURL: '../tests/data/Sample Short Interview.xml?data=ExtraData4templateURL',

  // fileDataURL: 'images/',
  fileDataURL:'../tests/data/',

  // getDataURL:'A2J_ViewerExit.html',
  getDataURL: '../tests/data/Sample Short Interview Answers.anx?data=ExtraData4getDataURL',

  // setDataURL saves answer file and leaves the viewer (its response replaces viewer's frame)
  setDataURL: '/save.aspx',

  // autoSetDataURL silently saves answer file periodically. (Optional).
  autoSetDataURL: '/autosave.aspx',

  // exitURL replaces the viewer's frame with this URL on EXIT (user 'fails' interview)
  exitURL: 'A2J_ViewerExit.html',

  // logURL accepts silent logging data.
  // E.g., https://lawhelpinteractive.org/a2j_logging
  logURL: '',

  // errRepURL accepts user's public submission of an error to which they can add an optional comment.
  // E.g., 'https://lawhelpinteractive.org/problem_reporting_form',
  errRepURL: ''
};
