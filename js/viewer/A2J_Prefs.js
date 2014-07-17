/******************************************************************************
	A2J Author 5 * Justice * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Global Preferences
	Required by Author and Viewers
	07/2014
	
******************************************************************************/


var gPrefs =
{
	// Persistent for author
	warnHotDocsNameLength : true, // include warning when var name length exceeds HotDocs length
	FKGradeAll : false,  // include grades for 'good' text as well
	showJS : false, 	// show JavaScript translations
	// Non persistent
	showLogic : 1, 	// show all logic or just filled
	showText : 1,	// show all text or just filled
}



gPrefs.save=function()
{	// Save prefs to HTML5 LocalStorage
	 if(typeof(Storage) !== "undefined")
	 {
		for (var p in this)
		{
			if (this.hasOwnProperty(p) && typeof this[p]!=='function')
			{
				//trace('Setting saved: '+p+' = '+this[p]);
				localStorage.setItem(p,this[p]); 
			}
		}
	 }
}
gPrefs.load=function()
{	// Load prefs from HTML5 LocalStorage
	 if(typeof(Storage) !== "undefined")
	 {
		for (var p in this)
		{
			if (this.hasOwnProperty(p) && typeof this[p]!=='function')
			{
				var v = localStorage.getItem(p);
				if (v !== null)
				{
					if (v=='true') {
						v=true;
					}
					else
					if (v=='false') {
						v=false
					}
					v= Number(v);
					//trace('Setting loaded: '+p+' = '+v);
					this[p] =Number(v);
				}
			}
		}
	 }	
}



/* */

