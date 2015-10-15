export default {
  // templateURL points to the interview XML. This demo just passes what's on the querystring.
  // templateURL: '/interview.xml',
  templateURL: '../../A2JGetInterview.aspx?data=2417^b4e01b9c-4573-4776-b195-cb9490ac0c3b^1c725dd1-8bf6-4dc5-955d-b0cfb94600a5',

  // fileDataURL is the folder of interview's assets, usually the folder of the interview XML
  // fileDataURL:'http://localhost:54583/Assets/A2J_Modules/New York/Vacate_Judgment_Consumer_Debt_2417/',
  fileDataURL: 'http://localhost/54583/Assets/A2J_Modules/New York/Vacate_Judgment_Consumer_Debt_2417/',

  // getDataURL loads an answer file at start, used for RESUME
  // getDataURL: '/resume.aspx',
  getDataURL: 'A2JGetData.aspx?data=0^b4e01b9c-4573-4776-b195-cb9490ac0c3b^2417^dcb160b4-7321-44c5-a99a-92d3e3efc1d6',

  // setDataURL saves answer file and leaves the viewer (its response replaces viewer's frame)
  // setDataURL: '/save.aspx',
  // setDataURL:  'A2J_ViewerAnswerSet.php?data=ExtraData4setDataURL',
  setDataURL: '../Engine/Index?q=6ick6e1t9CGdhvn+4ZDvkluGkgjfo/WZ9JkfJHXuyVKOBFj8ImxjPEfdygh4isgV7aDXg4hf5pKqRDHkQ/LZh1CBeIp9fuPfDT3jRXSaxrMEcuLrOVKIOfIyu6ceh9gTGkkbNFjDhQ+sLDrKt2jRnDaxpszkvXjFhhgqNtqM9V37wMgJq72zEoRPIUbEjRwHPg6i8g812pzK9gFIRHkVHcVAhM/dWQsqof9bXQ3azmANnQz6yXw1rJ75RpjlJ+KY7UGCwLxu86a5fLHzXWLwbg==',

  // autoSetDataURL silently saves answer file periodically. (Optional).
  autoSetDataURL: 'A2J_ViewerAutoSetData.php?data=ExtraData4autoSetDataURL',

  // exitURL replaces the viewer's frame with this URL on EXIT (user 'fails' interview)
  // exitURL: 'https://google.com', //'A2J_ViewerExit.php?interviewID=<?=$gid?>',
  exitURL: 'A2J_ViewerExit.html',

  // logURL accepts silent logging data.
  // E.g., https://lawhelpinteractive.org/a2j_logging
  logURL: 'A2J_ViewerLog.php?data=ExtraData4logURL',

  // errRepURL accepts user's public submission of an error to which they can add an optional comment.
  // E.g., 'https://lawhelpinteractive.org/problem_reporting_form'
  errRepURL: 'A2J_ViewerErrRep.php?data=ExtraData4errRepURL'
};
