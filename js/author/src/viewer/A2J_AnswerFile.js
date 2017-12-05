/*
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction

	Answer File IO

	12/22/2014, 02/20/2012

*/


// 2/28/05 Bug in HotDocs requires empty variable to NOT be included.
TGuide.prototype.HotDocsAnswerSetXML = function() {
  this.updateVarsForAnswerFile();

  // Build the Answer XML file.
  // Start with the DTD header.
  // 8/15/11 UTF-8 answer file format
  var xmlResult = CONST.HotDocsANXHeader_UTF8_str;

  xmlResult += '<AnswerSet title="">';

  var vi;
  var vars = this.vars;

  for (vi in vars) {
    if (1) {
      var v = vars[vi];
      xmlResult += this.HotDocsAnswerSetVariable(v);//+"\n";
    }
  }

  xmlResult += '</AnswerSet>';
  return xmlResult;
};

/** @param {TVariable} variable  */
TGuide.prototype.HotDocsAnswerSetVariable = function(variable) {
  // HotDocs requires a variable type.
  // This information is derived from the field's type.
  var field;

	// HotDocs doesn't like missing value fields.
	// 8/05 HotDocs local gets confused with variables that have no values.
	// 8/05 not sure if we include repeat values which may have blank values, so I include it.
	// 01/28/2008 1.8.6 For blank/null variables, use the unans="true" attribute.
	// this is what HotDocs wants and also forces XML nodes to remain present.
  var varType;
  field = this.variableToField(variable.name);

	if (field===null)
	{
		// We have a variable that has no field. Possible if we downloaded an answerset and the Interview has changed.
		//fieldType=CField.ftText
		varType=variable.type;
	}
	else
	{	// Use the field type to determine the HotDocs type to use.
		varType=field.fieldTypeToVariableType();
	}
	// Create XML Node like this:
	// <Answer name="Hire Date"><DateValue>4/1/2004</DateValue></Answer>
	// or
	// <Answer name="Gender"><MCValue><SelValue>4/1/2004</SelValue></MCValue></Answer>

	/*
	 <Answer name = "Vehicle make TE">
	  <RptValue>
	   <TextValue>Ford pickup</TextValue>
	   <TextValue>VW bug</TextValue>
	   <TextValue unans = "true"/>
	  </RptValue>
	 </Answer>
	 <Answer name = "Case type MC">
	  <MCValue>
	   <SelValue>Probate</SelValue>
	  </MCValue>
	 </Answer>
	*/

	// Possibilities:
	//	1. simple tag like <NumValue>55</NumValue>
	//	2. nested tag like <MCValue><SelValue>Minnesota</SelValue></MCValue>
	// 3. repeating tag like <RptValue><


	var mapVar2ANX={};
	mapVar2ANX[CONST.vtUnknown]=	"Unknown";
	mapVar2ANX[CONST.vtText]=		"TextValue";
	mapVar2ANX[CONST.vtTF]=			"TFValue";
	mapVar2ANX[CONST.vtMC]=			"MCValue";
	mapVar2ANX[CONST.vtNumber]=	"NumValue";
	mapVar2ANX[CONST.vtDate]=		"DateValue";
	mapVar2ANX[CONST.vtOther]=		"OtherValue";
	var ansType = mapVar2ANX[varType];
	// Type unknown possible with a Looping variable like CHILD
	if (ansType===CONST.vtUnknown || ansType === null || typeof ansType==='undefined'){
		ansType=[CONST.vtText];
	}

	function getXMLValue(value)
	{
		if (varType===CONST.vtDate)
		{
			// Ensure our m/d/y is converted to HotDocs d/m/y
			value=mdyTodmy(value);
		}
		var xmlV;
		if (typeof value==='undefined' || value===null || value==="")
		{	// 2014-06-02 SJG Blank value for Repeating variables MUST be in answer file (acting as placeholders.)
			xmlV  = '<'+ansType+' UNANS="true">' +  '' + '</'+ ansType+'>';
		}
		else
		{
			var val = escapeHtml(value);
			if (varType === CONST.vtMC)
			{	// 2015-01-12 MCValue > SelValue
				val = '<SelValue>' + val + '</SelValue>';
			}
			xmlV  = '<'+ansType+'>' +  val + '</'+ ansType+'>';
		}
		return xmlV;
	}
	var vi;
	var xml='';
	if (variable.repeating===true)
	{	// Repeating variables are nested in RptValue tag.
		for (vi=1 ; vi< variable.values.length; vi++)
		{
			xml += getXMLValue(variable.values[vi]);
		}
		xml = '<RptValue>' + xml + '</RptValue>';
	}
	else
	{
		var value=variable.values[1];
		if (!(typeof value==='undefined' || value===null || value===""))
		{	// 2014-06-02 SJG Blank value for non-repeating must NOT be in the answer file.
			xml = getXMLValue(value);
		}
	}
	if (xml!='') {
		xml = '<Answer name="' + variable.name + '">' + xml + '</Answer>';
	}
	//else{ trace("Skipping "+variable.name);}
	return xml;
};

// Create the A2J internal answer set variables.
TGuide.prototype.varCreateInternals = function() {
  this.varCreateOverride(CONST.vnVersion, CONST.vtText, false, 'A2J Author Version');
  this.varCreateOverride(CONST.vnInterviewID, CONST.vtText, false, 'Guide ID');
  this.varCreateOverride(CONST.vnBookmark, CONST.vtText, false, 'Current Page');
	this.varCreateOverride(CONST.vnHistory, CONST.vtText, false, 'Progress History List (XML)');
	// deprecated - TODO: remove completely
  // this.varCreateOverride(CONST.vnNavigationTF, CONST.vtTF, false, 'Allow navigation?');
  this.varCreateOverride(CONST.vnInterviewIncompleteTF, CONST.vtTF, false, 'Reached Successful Exit?');

  for (var s = 0; s < CONST.MAXSTEPS; s++) {
    this.varCreateOverride(CONST.vnStepPrefix + s, CONST.vtText, false, '');
  }
};

TGuide.prototype.updateVarsForAnswerFile=function()
{	// 6/30/10 Update bookmark, history info just before saving the answer file.
	this.varSet(CONST.vnVersion, CONST.A2JVersionNum);
	this.varSet(CONST.vnInterviewID, this.makeHash());
	this.varSet(CONST.vnBookmark,gPage.name);
	this.varSet(CONST.vnHistory,this.historyToXML());
};

TGuide.prototype.makeHash=function()//InterviewHash
{	// 2011-05-24 Make MD5 style hash of this interview
	var str = String(this.title)  + String(this.jurisdiction) +String(propCount(this.pages))
		+ String(this.description) + String(this.version) + String(this.language) + String(this.notes);
		//langID
	// TODO: MD5 or other function to get a somewhat unique ID to map answer file to interview file.
	return str.simpleHash();
};

// 11/13 Parse HotDocs answer file XML string into guide's variables.
// Add to existing variables. Do NOT override variable types.
TGuide.prototype.HotDocsAnswerSetFromXML = function(AnswerSetXML) {

  var mapANX2Var = {
    Unknown: CONST.vtUnknown,
    TextValue: CONST.vtText,
    TFValue: CONST.vtTF,
    MCValue: CONST.vtMC,
    NumValue: CONST.vtNumber,
    DateValue: CONST.vtDate,
    OtherValue: CONST.vtOther,
    RptValue: CONST.vtUnknown
  };

  var guide = this;

  $(AnswerSetXML).find('AnswerSet > Answer').each(function() {
    var varName = makestr($(this).attr('name'));

    // 12/03/2013 Do not allow # in variable names.
    if (varName.indexOf('#') >= 0) return;

    var vNew = false;
    var v = guide.varExists(varName);//guide.vars[varName_i];
    var varANXType = $(this).children().get(0).tagName;
    var varType = mapANX2Var[varANXType];

    // Variables not defined in the interview should be added in case we're
    // passing variables between interviews.
    if (v === null) {
      v = guide.varCreate(varName, varType, false, '');
      vNew = true;
    }

    switch (varANXType) {
      case 'TextValue':
        guide.varSet(varName, $(this).find('TextValue').html());
        break;

      case 'NumValue':
        guide.varSet(varName, $(this).find('NumValue').html());
        break;

      case 'TFValue':
        guide.varSet(varName, $(this).find('TFValue').html());
        break;

      case 'DateValue':
        guide.varSet(varName, dmyTomdy($(this).find('DateValue').html()));
        break;

      case 'MCValue':
        guide.varSet(varName, $(this).find('MCValue > SelValue').html());
        break;

      case 'RptValue':
        v.repeating = true;

        $('RptValue', this).children().each(function(i) {
          varANXType = $(this).get(0).tagName;
          varType = mapANX2Var[varANXType];

          switch (varANXType) {
            case 'TextValue':
            case 'NumValue':
            case 'TFValue':
            case 'DateValue':
              guide.varSet(varName, dmyTomdy($(this).html()), i + 1);
              break;

            case 'MCValue':
              guide.varSet(varName, $(this).find('SelValue').html());
              break;
          }
        });

        break;
    }

    if (v.type === CONST.vtUnknown) {
      v.type = varType;
      if (v.type === CONST.vtUnknown) {
        varName = varName.split(' ');
        varName = varName[varName.length - 1];

        if (varName === 'MC') {
          v.type = CONST.vtMC;
        } else if (varName === 'TF') {
          v.type = CONST.vtTF;
        } else if (varName === 'NU') {
          v.type = CONST.vtNumber;
        } else {
          v.type = CONST.vtText;
        }

        v.warning = 'Type not in answer file, assuming ' + v.type;
      }
    }

    v.traceLogic(vNew ? 'Creating new:' : 'Replacing:');
  });
};

TGuide.prototype.loadXMLAnswerExternal = function (opts)
/*	Load a XML based answer file. */
{	// Load list from opts.url, default list value will be opts.val, and XML stored in opts.elt.
   $.ajax({
      url:  (opts.url),
      dataType:  "xml",
      timeout: gConfig.AJAXLoadingTimeout,
		opts: opts,
      error:
			/*** @this {{url}} */
			function(data,textStatus,thrownError)
			{
				dialogAlert({title:'Error loading answer file',body:'Unable to load answer file from '+this.url+"\n"+textStatus});
			},
      success:
			function(data)
			{
				gGuide.HotDocsAnswerSetFromXML($(data));
				if (opts.success) {
					opts.success();
				}
			}
   });
};



/* */
