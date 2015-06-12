******************************************************************************
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
******************************************************************************

2015-06-12

This is a package of files required to run the A2J 5 Viewer on an installation on a 3rd party server. This does not contain Authoring app code. This code will not load A2J 4 interviews. 

Main change from previous demo packages is a tweak to ensure mobile viewer loads the guide from correct location and an external config file to change file loading timeouts (desktop_app.config.js).

The file struture for A2J5 is similar to A2J4. There's a 'host' HTML file (viewer/index.html) which will contain the desktop/mobile selection code (currently a test for 'touch' enabled device) and a configuration section to specify data access and reporting. Like A2J4, your server can generate this page with appropriate paths prefilled in on per interview/user/answer file basis. 

For demonstration purposes there are some simple static file paths that reference a tiny sample interview. That sample interview and answer file are in folder tests/data. There's an XML for the interview (Guide.xml) and a separate file for the mobile viewer (Guide.json).

Note, the mobile viewer ignores the templateURL. Instead it attempts to load the file Guide.json from the path in fileDataURL. 

I've also setup a live version at:
http://authordev.a2jauthor.org/app/demo/server/viewer/index.html

The live version loads the sample interview and the answer file. At the end of the interview it will simply echo back the answer file received. Answer file is posted in the same mannger as A2J4 - a form POST with the answer file xml in a variable called AnswerKey.

In the host file you'll also see a parameter to handle automatic saving. This isn't active yet. When autosave is implemented a blank parameter will simply disable it.

I'm still looking at error reporting. Currently it's just cloned from A2J4. Since the reporting was added to resolve Flash issues it may no longer be needed.

Both the FAIL and SUCCESS exits are coded to replace the parent frame, the index.html. This maybe eventually changed to an AJAX call.

