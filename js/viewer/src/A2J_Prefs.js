/*
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Global Preferences for Authoring, referenced by Viewer in Author.
	Required by Author and Viewers
	07/2014

*/


var gPrefs =
{
	// Persistent for author

	// Include warning when var name length exceeds HotDocs length
	warnHotDocsNameLength : true,

	// Include grades for 'good' text as well
	FKGradeAll : false,

	// Show JavaScript translations
	showJS : false,

	// Non persistent

	// Show all logic or just filled
	showLogic : 1,

	// Show all text or just filled
	showText : 1

};



gPrefs.save=function()
{	// Save prefs to HTML5 LocalStorage
	 if(typeof(Storage) !== "undefined")
	 {
		for (var p in gPrefs)
		{
			if (gPrefs.hasOwnProperty(p) && typeof gPrefs[p]!=='function')
			{
				//trace('Setting saved: '+p+' = '+this[p]);
				localStorage.setItem(p,gPrefs[p]);
			}
		}
	 }
};

gPrefs.load=function()
{	// Load prefs from HTML5 LocalStorage
	 if(typeof(Storage) !== "undefined")
	 {
		for (var p in gPrefs)
		{
			if (gPrefs.hasOwnProperty(p) && typeof gPrefs[p]!=='function')
			{
				try {
					var v = localStorage.getItem(p);
					if (v !== null)
					{
						if (v==='true') {
							v=true;
						}
						else
						if (v==='false') {
							v=false;
						}
						v= Number(v);
						//trace('Setting loaded: '+p+' = '+v);
						gPrefs[p] =Number(v);
					}
				}
				catch (e)
				{

				}
			}
		}
	 }
};



/* */
