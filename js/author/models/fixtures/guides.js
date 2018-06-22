import fixture from "can-fixture";
import guidesList from './guides/guides-list.json';
import thrcInterviewXML from './guides/thrc-interview.xml!text';
import mobileInterviewXML from './guides/mobile-online-interview.xml!text';
import assetCountLoopInterviewXML from './guides/asset-count-loop-interview.xml!text';

const userData = {
  userid: 78740,
  userdir: 'john_1',
  username: 'john_1',
  nickname: 'John Doe'
};

const existingGuide = {
  gid: '1261',
  editoruid: '78740',
  guide: "<?xml version=\"1.0\" encoding=\"UTF-8\" ?><GUIDE><INFO><AUTHORS><AUTHOR><NAME>Anonymous<\/NAME><\/AUTHOR><\/AUTHORS><TOOL>A2J<\/TOOL><TOOLVERSION>2012-04-19<\/TOOLVERSION><AVATAR>avatar1<\/AVATAR><DESCRIPTION>This is a description of my interview.<\/DESCRIPTION><JURISDICTION>Jurisdiction of my interview<\/JURISDICTION><LANGUAGE>en<\/LANGUAGE><NOTES>6\/24\/2015 interview created.<\/NOTES><SENDFEEDBACK>false<\/SENDFEEDBACK><SUBJECTAREA>Jurisdiction of my interview<\/SUBJECTAREA><TITLE>My Interview (6\/24\/2015)<\/TITLE><VERSION>6\/24\/2015<\/VERSION><VIEWER>A2J<\/VIEWER><FIRSTPAGE>1-Introduction<\/FIRSTPAGE><\/INFO><PAGES><PAGE NAME=\"1-Introduction\" TYPE=\"A2J\" MAPX=\"6\" MAPY=\"208\" STEP=\"0\"><TEXT><P><FONT>This is the introduction.<\/FONT><\/P><\/TEXT><BUTTONS><BUTTON NEXT=\"2-Name\"\/><\/BUTTONS><\/PAGE><PAGE NAME=\"2-Name\" TYPE=\"A2J\" MAPX=\"11\" MAPY=\"381\" STEP=\"0\"><TEXT><P><FONT>Enter your name.<\/FONT><\/P><\/TEXT><BUTTONS><BUTTON NEXT=\"3-Gender\"\/><\/BUTTONS><FIELDS><FIELD TYPE=\"text\" ORDER=\"ASC\" REQUIRED=\"true\"><LABEL>First:<\/LABEL><NAME>Client first name TE<\/NAME><INVALIDPROMPT>You must type a response in the highlighted space before you can continue.<\/INVALIDPROMPT><\/FIELD><FIELD TYPE=\"text\" ORDER=\"ASC\" REQUIRED=\"false\"><LABEL>Middle:<\/LABEL><NAME>Client middle name TE<\/NAME><INVALIDPROMPT>You must type a response in the highlighted space before you can continue.<\/INVALIDPROMPT><\/FIELD><FIELD TYPE=\"text\" ORDER=\"ASC\" REQUIRED=\"true\"><LABEL>Last:<\/LABEL><NAME>Client last name TE<\/NAME><INVALIDPROMPT>You must type a response in the highlighted space before you can continue.<\/INVALIDPROMPT><\/FIELD><\/FIELDS><\/PAGE><PAGE NAME=\"3-Gender\" TYPE=\"A2J\" MAPX=\"249\" MAPY=\"113\" STEP=\"0\"><TEXT>Choose your gender.<\/TEXT><BUTTONS><BUTTON NEXT=\"1-Question 1\"\/><\/BUTTONS><FIELDS><FIELD TYPE=\"gender\" REQUIRED=\"true\"><LABEL>Gender:<\/LABEL><NAME>User Gender<\/NAME><\/FIELD><\/FIELDS><\/PAGE><PAGE NAME=\"1-Question 1\" TYPE=\"A2J\" MAPX=\"255\" MAPY=\"377\" STEP=\"1\"><TEXT><P><FONT>Text of my first question goes here.<\/FONT><\/P><\/TEXT><\/PAGE><\/PAGES><STEPS><STEP NUMBER=\"0\"><TEXT>ACCESS TO JUSTICE<\/TEXT><\/STEP><STEP NUMBER=\"1\"><TEXT>DO YOU QUALIFY?<\/TEXT><\/STEP><STEP NUMBER=\"2\"><TEXT>DO YOU AGREE?<\/TEXT><\/STEP><STEP NUMBER=\"3\"><TEXT>YOUR INFORMATION<\/TEXT><\/STEP><\/STEPS><VARIABLES><VARIABLE NAME=\"User Gender\" TYPE=\"Text\" COMMENT=\"User's gender will be used to display appopriate avatar.\"\/><VARIABLE NAME=\"User Avatar\" TYPE=\"Text\"\/><VARIABLE NAME=\"Client first name TE\" TYPE=\"Text\"\/><VARIABLE NAME=\"Client middle name TE\" TYPE=\"Text\"\/><VARIABLE NAME=\"Client last name TE\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Version\" TYPE=\"Text\" COMMENT=\"A2J Author Version\"\/><VARIABLE NAME=\"A2J Interview ID\" TYPE=\"Text\" COMMENT=\"Guide ID\"\/><VARIABLE NAME=\"A2J Bookmark\" TYPE=\"Text\" COMMENT=\"Current Page\"\/><VARIABLE NAME=\"A2J History\" TYPE=\"Text\" COMMENT=\"Progress History List (XML)\"\/><VARIABLE NAME=\"A2J Navigation TF\" TYPE=\"TF\" COMMENT=\"Allow navigation?\"\/><VARIABLE NAME=\"A2J Interview Incomplete TF\" TYPE=\"TF\" COMMENT=\"Reached Successful Exit?\"\/><VARIABLE NAME=\"A2J Step 0\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 1\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 2\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 3\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 4\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 5\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 6\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 7\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 8\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 9\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 10\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 11\" TYPE=\"Text\"\/><\/VARIABLES><\/GUIDE>",
  path: '\/app\/userfiles\/manuel_1\/guides\/Guide1261\/Guide.xml',
  userid: 78740
};

const blankGuide = {
  gid: '1264',
  editoruid: '78740',
  guide: "<?xml version=\"1.0\" encoding=\"UTF-8\" ?><GUIDE><INFO><AUTHORS><AUTHOR><NAME>Anonymous<\/NAME><\/AUTHOR><\/AUTHORS><TOOL>A2J<\/TOOL><TOOLVERSION>2012-04-19<\/TOOLVERSION><AVATAR>avatar1<\/AVATAR><DESCRIPTION>This is a description of my interview.<\/DESCRIPTION><JURISDICTION>Jurisdiction of my interview<\/JURISDICTION><LANGUAGE>en<\/LANGUAGE><NOTES>6\/24\/2015 interview created.<\/NOTES><SENDFEEDBACK>false<\/SENDFEEDBACK><SUBJECTAREA>Jurisdiction of my interview<\/SUBJECTAREA><TITLE>My Interview (6\/24\/2015)<\/TITLE><VERSION>6\/24\/2015<\/VERSION><VIEWER>A2J<\/VIEWER><FIRSTPAGE>1-Introduction<\/FIRSTPAGE><\/INFO><PAGES><PAGE NAME=\"1-Introduction\" TYPE=\"A2J\" MAPX=\"6\" MAPY=\"208\" STEP=\"0\"><TEXT><P><FONT>This is the introduction.<\/FONT><\/P><\/TEXT><BUTTONS><BUTTON NEXT=\"2-Name\"\/><\/BUTTONS><\/PAGE><PAGE NAME=\"2-Name\" TYPE=\"A2J\" MAPX=\"11\" MAPY=\"381\" STEP=\"0\"><TEXT><P><FONT>Enter your name.<\/FONT><\/P><\/TEXT><BUTTONS><BUTTON NEXT=\"3-Gender\"\/><\/BUTTONS><FIELDS><FIELD TYPE=\"text\" ORDER=\"ASC\" REQUIRED=\"true\"><LABEL>First:<\/LABEL><NAME>Client first name TE<\/NAME><INVALIDPROMPT>You must type a response in the highlighted space before you can continue.<\/INVALIDPROMPT><\/FIELD><FIELD TYPE=\"text\" ORDER=\"ASC\" REQUIRED=\"false\"><LABEL>Middle:<\/LABEL><NAME>Client middle name TE<\/NAME><INVALIDPROMPT>You must type a response in the highlighted space before you can continue.<\/INVALIDPROMPT><\/FIELD><FIELD TYPE=\"text\" ORDER=\"ASC\" REQUIRED=\"true\"><LABEL>Last:<\/LABEL><NAME>Client last name TE<\/NAME><INVALIDPROMPT>You must type a response in the highlighted space before you can continue.<\/INVALIDPROMPT><\/FIELD><\/FIELDS><\/PAGE><PAGE NAME=\"3-Gender\" TYPE=\"A2J\" MAPX=\"249\" MAPY=\"113\" STEP=\"0\"><TEXT>Choose your gender.<\/TEXT><BUTTONS><BUTTON NEXT=\"1-Question 1\"\/><\/BUTTONS><FIELDS><FIELD TYPE=\"gender\" REQUIRED=\"true\"><LABEL>Gender:<\/LABEL><NAME>User Gender<\/NAME><\/FIELD><\/FIELDS><\/PAGE><PAGE NAME=\"1-Question 1\" TYPE=\"A2J\" MAPX=\"255\" MAPY=\"377\" STEP=\"1\"><TEXT><P><FONT>Text of my first question goes here.<\/FONT><\/P><\/TEXT><\/PAGE><\/PAGES><STEPS><STEP NUMBER=\"0\"><TEXT>ACCESS TO JUSTICE<\/TEXT><\/STEP><STEP NUMBER=\"1\"><TEXT>DO YOU QUALIFY?<\/TEXT><\/STEP><STEP NUMBER=\"2\"><TEXT>DO YOU AGREE?<\/TEXT><\/STEP><STEP NUMBER=\"3\"><TEXT>YOUR INFORMATION<\/TEXT><\/STEP><\/STEPS><VARIABLES><VARIABLE NAME=\"User Gender\" TYPE=\"Text\" COMMENT=\"User's gender will be used to display appopriate avatar.\"\/><VARIABLE NAME=\"User Avatar\" TYPE=\"Text\"\/><VARIABLE NAME=\"Client first name TE\" TYPE=\"Text\"\/><VARIABLE NAME=\"Client middle name TE\" TYPE=\"Text\"\/><VARIABLE NAME=\"Client last name TE\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Version\" TYPE=\"Text\" COMMENT=\"A2J Author Version\"\/><VARIABLE NAME=\"A2J Interview ID\" TYPE=\"Text\" COMMENT=\"Guide ID\"\/><VARIABLE NAME=\"A2J Bookmark\" TYPE=\"Text\" COMMENT=\"Current Page\"\/><VARIABLE NAME=\"A2J History\" TYPE=\"Text\" COMMENT=\"Progress History List (XML)\"\/><VARIABLE NAME=\"A2J Navigation TF\" TYPE=\"TF\" COMMENT=\"Allow navigation?\"\/><VARIABLE NAME=\"A2J Interview Incomplete TF\" TYPE=\"TF\" COMMENT=\"Reached Successful Exit?\"\/><VARIABLE NAME=\"A2J Step 0\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 1\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 2\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 3\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 4\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 5\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 6\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 7\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 8\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 9\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 10\" TYPE=\"Text\"\/><VARIABLE NAME=\"A2J Step 11\" TYPE=\"Text\"\/><\/VARIABLES><\/GUIDE>",
  path: '\/app\/userfiles\/manuel_1\/guides\/Guide1264\/Guide.xml',
  userid: 78740
};

const mobileGuide = {
  gid: '5',
  editoruid: '78740',
  guide: mobileInterviewXML,
  path: '\/app\/userfiles\/A2J\/guides\/A2J_MobileOnline\/A2J_MobileOnlineInterview_Interview.xml',
  userid: 78740
};

const thrcGuide = {
  gid: '20',
  editoruid: '78740',
  guide: thrcInterviewXML,
  path: '\/app\/userfiles\/A2J\/guides\/A2J_MobileOnline\/A2J_MobileOnlineInterview_Interview.xml',
  userid: 78740
};

const assetCountLoopGuide = {
  gid: '20',
  editoruid: '78740',
  guide: assetCountLoopInterviewXML,
  path: '\/app\/userfiles\/A2J\/guides\/A2J_MobileOnline\/A2J_MobileOnlineInterview_Interview.xml',
  userid: 78740
};

const selectGuide = function(guideId) {
  let guide;

  switch (guideId) {
    case '1261':
      guide = existingGuide;
      break;

    case '1264':
      guide = blankGuide;
      break;

    case '5':
      guide = mobileGuide;
      break;

    case '20':
      guide = thrcGuide;
      break;

    case '573':
      guide = assetCountLoopGuide;
      break;

    default:
      guide = existingGuide;
  }

  return guide;
};

export default fixture('POST CAJA_WS.php', function(req, res) {
  var cmd = req.data ? req.data.cmd : null;

  switch (cmd) {
    case 'login':
      res(userData);
      break;

    case 'guides':
      res(guidesList);
      break;

    case 'guide':
      res(selectGuide(req.data.gid));
      break;

    case 'guidesave':
      res({
        "info": "Will update!",
        "userid":  78740
      });
      break;

    case 'guidesaveas':
      res({
        "url":"\/vol\/data\/sites\/author\/userfiles\/manuel_1\/guides\/Guide1264\/Guide.xml",
        "gid": 1264,
        "userid": 78740
      });
      break;

    default:
      console.error('Missing fixture ', req.data);
  }
});
