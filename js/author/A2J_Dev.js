/*******************************************************************************
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	
	Developer coding.
******************************************************************************/



TGuide.prototype.HotDocsAnswerSetFromCMPXML=function(cmp)
{	// 2014-08-25 Extract variables from HotDocs .CMP file (XML format)
	// Lots of handy settings that could be imported to A2J in addition to variable name/type
	/*
		<hd:components>
		<hd:text name="AGR Petitioner Mother-Father-TE" askAutomatically="false" saveAnswer="false" warnIfUnanswered="false"/>
		<hd:text name="Abuse TE" askAutomatically="false">
			<hd:prompt>List the date of every incident, the allegation, whether «Petitioner full name CO» was required to attend court, and the disposition.</hd:prompt>
			<hd:multiLine height="2"/>
		</hd:text>
	*/
	/** @type {TGuide} */
	var guide=this;
	
	//cmp.find('hd\\:components').children().each(function() //  doesn't work in chrome

	cmp.find("*").each(function()
	{	// Search for components A2J can handle
		var name = makestr($(this).attr("name"));
		var comment=''; // TODO? get prompt info as a comment?
		var repeating=false;
		switch (this.nodeName)
		{
			case 'hd:text':
				// hd:text name="AGR Petitioner Mother-Father-TE" askAutomatically="false" saveAnswer="false" warnIfUnanswered="false"/>
				guide.varCreate(name,CONST.vtText,repeating,comment);
				break;
			
			
			
			case 'hd:trueFalse':
				// <hd:trueFalse name="Petitioner unemployment TF">
				guide.varCreate(name,CONST.vtTF,repeating,comment);
				break;
			
			case 'hd:date':
				//	<hd:date name="Date child came into petitioner care DA">
				//		<hd:defFormat>June 3, 1990</hd:defFormat>
				//		<hd:prompt>Date on which child came into care of petitioner(s)</hd:prompt>
				//		<hd:fieldWidth widthType="calculated"/>
				//	</hd:date>
				guide.varCreate(name,CONST.vtDate,repeating,comment);
				break;
			
			case 'hd:number':
				//	<hd:number name="Putative children counter" askAutomatically="false" saveAnswer="false" warnIfUnanswered="false"/>
				guide.varCreate(name,CONST.vtNumber,repeating,comment);
				break;
			
			case 'hd:multipleChoice':
				// <hd:multipleChoice name="Child gender MC" askAutomatically="false">
				guide.varCreate(name,CONST.vtMC,repeating,comment);
				break;
			
			case 'hd:computation':
				//	<hd:computation name="Any parent address not known CO" resultType="trueFalse">
				// <hd:computation name="A minor/minors aff of due dliligence CO" resultType="text">
				var resultType=$(this).attr("resultType");
				switch (resultType)
				{
					case 'text':
						guide.varCreate( name,CONST.vtText,repeating,comment);
						break;
					case 'trueFalse':
						guide.varCreate( name,CONST.vtTF,repeating,comment);
						break;
				}
				break;
		}
	});
	
	guide.noviceTab('tabsVariables',true);
};

/* */

