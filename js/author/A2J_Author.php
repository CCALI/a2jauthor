<!DOCTYPE HTML>
<!--
	A2J Author 5 * Justice * justicia * 正义 * công lý * 사법 * правосудие
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	04/15/2013
	05/2014
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<link rel="shortcut icon" href="http://www.a2jauthor.org/sites/all/themes/a2j_author/favicon.ico" type="image/jpeg" />
<title>A2J Author 5</title>
<?php

date_default_timezone_set("America/Chicago");
function ts($filename)
{	// To avoid constantly reloading everything every time during testing, add file's modified time as the timestamp.
	// Then cache always only updates for changes.
	return '"'.$filename.'?ver='.date("Y-m-d-H-i-s",filemtime($filename)).'"';
}
?>

<link xhref="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/sunny/jquery-ui.css"  title="style" rel="stylesheet" type="text/css"/>
<link xhref="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/ui-darkness/jquery-ui.css"  title="style" rel="stylesheet" type="text/css"/>

<!--
<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,400italic&subset=latin,vietnamese,latin-ext' rel='stylesheet' type='text/css'>
-->
<link href='../viewer/A2J_Fonts.css' rel='stylesheet' type='text/css'>


<link href="author.jquery-ui.css" title="style"  rel="stylesheet" type="text/css"/>
<link href="jquery.fileupload-ui.css" rel="stylesheet" type="text/css" />
<link href=<?=ts('A2J_Author.css')?>  rel="stylesheet" type="text/css"/>
<link href="../viewer/jquery-ui.extra.css" rel="stylesheet" type="text/css" />
<link href="../viewer/viewer.jquery-ui.css" rel="stylesheet" type="text/css" />
<link href=<?=ts('../viewer/A2J_Viewer.css')?>  rel="stylesheet" type="text/css"/>

<script src="../viewer/jquery.1.8.2.min.js" type="text/javascript"></script>
<script src="../viewer/jquery.ui.1.9.1.min.js" type="text/javascript"></script>

<script xsrc="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<script xsrc="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js" type="text/javascript"></script>



<?php
	switch ( 1 ){
		case 0:	// include minimized code
		?>
			<script src="jQuery/jquery.custom.min.js?jsver=" type="text/javascript"></script>
			<script src="A2J_AuthorApp.min.js?jsver=" type="text/javascript"></script>
		<?php
			break;
		
		case 1:	// include full source code
		?>
		
			<script src="../viewer/jquery.xml.min.js" type="text/javascript" ></script>
			<script src="../viewer/jquery.ui.combobox.js" type="text/javascript" ></script>
			<script src="../viewer/jquery.ui.traggable.js" type="text/javascript" ></script>
			<script src="../viewer/jshashtable-2.1.js" type="text/javascript"></script>
			<script src="../viewer/jquery.numberformatter-1.2.1.jsmin.js" type="text/javascript"></script>
			
			<script src="jquery.fileupload.js"></script><!-- The basic File Upload plugin -->
			<script src="jquery.fileupload-process.js"></script><!-- The File Upload processing plugin -->
			<script src="jquery.fileupload-validate.js"></script><!-- The File Upload validation plugin -->
			
			<script src=<?=ts('../viewer/desktop_app.config.js')?> type="text/javascript"></script>
			<script src=<?=ts('../viewer/A2J_Types.js')?> type="text/javascript"></script>
			<script src=<?=ts('../viewer/A2J_Prefs.js')?> type="text/javascript"></script>
			<script src=<?=ts('../viewer/A2J_Shared.js')?> type="text/javascript"></script>
			<script src=<?=ts('../viewer/A2J_SharedSus.js')?> type="text/javascript"></script>
			<script src=<?=ts('../viewer/A2J_Languages.js')?> type="text/javascript"></script>
			
			<script src=<?=ts('../viewer/A2J_AnswerFile.js')?> type="text/javascript"></script>
			<script src=<?=ts('../viewer/A2J_MobileFile.js')?> type="text/javascript"></script>
			<script src=<?=ts('../viewer/A2J_Logic.js')?> type="text/javascript"></script>
			<script src=<?=ts('../viewer/A2J_Parser.js')?> type="text/javascript"></script>
			<script src=<?=ts('../viewer/A2J_ParserConvert.js')?> type="text/javascript"></script>
			<script src=<?=ts('../viewer/A2J_Viewer.js')?> type="text/javascript"></script>
			
			<script src=<?=ts('A2J_Vars.js')?> type="text/javascript"></script>
			<script src=<?=ts('A2J_Clauses.js')?> type="text/javascript"></script>
			<script src=<?=ts('A2J_Pages.js')?> type="text/javascript"></script>
			<script src=<?=ts('A2J_Guides.js')?> type="text/javascript"></script>
			<script src=<?=ts('A2J_Tabs.js')?> type="text/javascript"></script>
			<script src=<?=ts('A2J_Reports.js')?> type="text/javascript"></script>
			<script src=<?=ts('A2J_Mapper.js')?> type="text/javascript"></script>
			<script src=<?=ts('A2J_Dev.js')?> type="text/javascript"></script>
			<script src=<?=ts('A2J_AuthorApp.js')?> type="text/javascript"></script>
			<script src=<?=ts('A2J_Debug.js')?> type="text/javascript"></script>
			<script src=<?=ts('TextStatistics.js')?> type="text/javascript"></script>
		<?php
			break;
		case 2:
		?>
			<script src="jquery.custom.min.js?jsver=" type="text/javascript" ></script>
			<script src="A2J_AuthorOne.js?jsver=" type="text/javascript"></script>
		<?php
			break;
	}
?>
<script>
<?php
	// 4/2014 For demo purposes, we CAN extract guide and answer file urls from the querystring and pass them on to the Viewer.
	// Normally only the Viewer will use these startups values.
	$gid = '';
	$aid = '';
	if (isset($_GET['gid'])){$gid=$_GET['gid'];}
	if (isset($_GET['aid'])){$aid=$_GET['aid'];}
?> 
	gStartArgs.templateURL = "<?=$gid?>";
	gStartArgs.getDataURL = "<?=$aid?>";
</script>


<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body class="ui-widget-content">
<div id="splash" class="welcome">
	<div align="center"> <img src="../viewer/images/A2J5_Icon_512.png"/>  </div>
</div>
	
<div id="page-viewer" class="hidestart ViewerApp a2jv">
	<div class="testing ui-widget-content">
		<div id="viewer-logic-form" class="ViewerLogicForm">
			<div class="tracepanel"><ol id="tracer" contentEditable="true"></ol></div>
			<div class="immediatepanel">
				
				<span>
				<input type="text" id="tracerimm"/></span>
				<button id="clearTrace"></button>
				
				</div></div>
		<div id="viewer-var-form" class="ViewerVarForm" ></div>
	</div>
	<div class="A2JViewer"></div>
	<div class="alertPanel"></div><div class="alertCounter"></div>
</div>
	
	
<div id="authortool" class="hidestart authortool">
	<div class="guideio">
	</div>
	<div class="guidemenu ui-state-default">
		<ul>
			<li ref="tabsAbout">About</a></li>
			<li ref="tabsVariables">Variables</a></li>
			<!--<li ref="tabsClauses">Clauses</a></li>-->
			<li ref="tabsSteps">Steps</a></li>
			<li ref="tabsPages">Pages</a></li>
			<li ref="tabsMap">Map</a></li>
			<li ref="tabsFiles">Files</a></li>
			<li ref="tabsLogic">All Logic</a></li>
			<li ref="tabsText">All Text</a></li>
			<li ref="tabsPreview">Preview</a></li>
			<li ref="tabsReport">Report</a></li>
			<li ref="tabsUpload">Publish</a></li>
			<li ref="tabsGuides">Interviews</a></li>
		</ul>
	</div>
	<div class="guidepanels ui-widget xui-widget-content">
		<div class="panel" id="tabsAbout">
			<div class="tabHeader">
<!-- JPM expand/collapse for about tab panel -->
					<button class="ecPanelButton"></button> Information about this interview
			<button CSH="About" class="CSH"/></div>
			
			<div class="tabContentFrame">
				<div class="tabContent editq"></div>
			</div>
		</div>
		<div class="panel" id="tabsVariables">
			<div class="tabHeader">Variables used in this interview
			<button CSH="Variables" class="CSH"/></div>
			
			<div class="tabContentFrame">
				<div class="tabContent editq"></div>
			</div>
			<div class="tabFooter">
				<button id="var-add">Add</button>
			<span class="fileinput-button">
				<button id="uploadCMPFile">Add from HotDocs .CMP</button><input type="file" id="uploadCMPFileInput"/>
			</span>
			</div>
		</div>
		<div class="panel" id="tabsClauses">
			<div class="tabHeader">Clauses used in this interview
			<button CSH="Clauses" class="CSH"/></div>
			
			<div class="tabContentFrame">
				<div class="tabContent editq"></div>
			</div>
			<div class="tabFooter">
				<button id="clause-add">Add</button>
			</div>
		</div>
		<div class="panel" id="tabsSteps">
			<div class="tabHeader">Steps <button CSH="Steps" class="CSH"/> </div>
			<div class="tabContentFrame">
				<div class="tabContent editq"></div>
			</div>
		</div>
		<div class="panel" id="tabsPages">
			<div class="tabHeader">
			<button id="expandCollapse"></button>
			Pages and popups
			<button CSH="Pages" class="CSH"/> 
				<!--<form>
					<div id="showpagelist">
						<input checked="checked" 	type="radio" id="showpagelist1" name="showpagelist" /><label for="showpagelist1">Outline</label>
						<input 							type="radio" id="showpagelist2" name="showpagelist" /><label for="showpagelist2">Alphabetical</label>
					</div>
				</form>-->
			</div>
			<div class="tabContentFrame">
				<div class="tabsPages">
					<div class="PagesPanel">
					<div id="CAJAOutline" class="pageoutline pagelist">
						<ul>
						</ul>
					</div><!--
					<div id="CAJAIndex" class="pagelist">
						<ul>
						</ul>
					</div>-->
					<!--			<div id="tabsfind"> Find? </div>--></div>
					<div class="tabFooter">
						<button ></button>
						<button ></button>
						<button ></button>
						<button ></button>
						<button ></button>
					</div>
					</div>
	
			</div>			 
		</div>
		<div class="panel" id="tabsMap">		
			<div class="tabHeader">
			</div>
			<div class="tabContentFrame">
				<div class="tabsMapPages">
					<div class="PagesPanel">
					<div id="CAJAOutlineMap" class="pageoutline pagelist">
						<ul>
						</ul>
					</div></div>
					<div class="tabFooter">
					</div>
					</div>
				<div id="tabsMapper">
					<div id="MapperPanel">
						<div class="map"></div>
					</div>
					<div class="tabFooter">
<!-- JPM added button to hide/show page list -->
						<button></button>
						<button zoom="fit"></button>
						<button zoom="1.25"></button>
						<button zoom="0.75"></button>
						<button CSH="Map" class="CSH"/> 
					</div>
				</div>
			</div>			 
		</div>
		<div class="panel" id="tabsLogic">
			<div class="tabHeader"> 
					<div id="showlogic">
						<input checked="checked" type="radio" id="showlogic1" name="showlogic" />
						<label for="showlogic1">Show only active code</label>
						<input type="radio" id="showlogic2" name="showlogic" />
						<label for="showlogic2">Show all code blocks</label>
					</div> 
					<button class="ecPanelButton"/>
					<button CSH="AllLogic" class="CSH"/>
			</div>
			<div class="tabContentFrame">
				<div class="tabContent editq"></div>
			</div>
		</div>
		<div class="panel" id="tabsText">
			<div class="tabHeader">
					<div id="showtext">
						<input checked="checked" type="radio" id="showtext1" name="showtext" />
						<label for="showtext1">Filled fields</label>
						<input type="radio" id="showtext2" name="showtext" />
						<label for="showtext2">All fields</label>
					</div>
					<button class="ecPanelButton"/>
					<button CSH="AllText" class="CSH"/> 
			</div>
			<div class="tabContentFrame">
				<div class="tabContent editq"></div>
			</div>
		</div>
		
		
<div class="panel" id="tabsFiles">
	<div class="tabHeader">Files currently attached to this interview
		<button CSH="Files" class="CSH"/> </div>
	<div class="tabContentFrame">
		<div class="tabContent editq"><table class="A2JFiles"><tbody id="attachmentFiles" class="files"></tbody></table>
		</div>
	</div>
	<div class="tabFooter">
		<div class="fileuploader"> 		
			<!-- The fileinput-button span is used to style the file input field as button -->
			<span class="fileinput-button">
			<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">
				<span class="ui-button-icon-primary ui-icon ui-icon-plus"></span>
				<span class="ui-button-text" >Upload files...</span>
			</button>	
				<!-- The file input field used as target for the file upload widget -->
				<input id="fileupload" type="file" name="files[]" multiple />
			</span>
			<div id="progress" class="progress progress-success progress-striped"><div class="bar"></div></div>
		</div><!--<button id="guideSave" />-->
	</div>
</div>

	<div class="panel" id="tabsGuides">
		<div class="tabHeader">A2J Guided Interviews®
		<button CSH="Interviews" class="CSH"/></div>
		<div class="tabContentFrame">
			<div class="tabContent editq">
					<p class="name"></p>
					<p>What would you like to do? </p>
					
					
			<fieldset name="record"><legend>Create a new interview</legend><ul  class="guidelist" id="guideListNew"></ul></fieldset>
			<fieldset name="record"><legend>Edit one of my interviews</legend><ul  class="guidelist" id="guideListMy"></ul></fieldset>
			<fieldset name="record"><legend>Open a Sample interview</legend><ul class="guidelist" id="guideListSamples"></ul></fieldset>
	
			</div>
		</div>
		<div class="tabFooter">
			<div > 
				<!--	<button id="guideCreate">New</button>-->
					<button id="guideClone">Clone</button>
					<button id="guideOpen">Open</button>
					<button id="guideArchive">Delete</button>
				<div class="fileuploader">
				<!-- The fileinput-button span is used to style the file input field as button -->
				<span class="fileinput-button">
				<button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary">
					<span class="ui-button-icon-primary ui-icon ui-icon-plus"></span>
					<span class="ui-button-text" >Upload A2J Guided Interview...</span>
				</button>	
					<!-- The file input field used as target for the file upload widget -->
					<input id="guideupload" type="file" name="files[]" multiple />
				</span>
				<div id="guideuploadprogress" class="progress progress-success progress-striped"><div class="bar"></div></div>
			</div></div>
		</div>
	</div>

		<div class="panel" id="tabsReport"> 
			<div class="tabHeader">
				<button id="reportFull">Full Report</button> <button id="reportTranscript">Transcript Report</button>  <button CSH="Report" class="CSH"/>
			</div>
			
			<div class="tabContentFrame">
				<div class="tabContent editq">
					Report of text in a print-friendly layout, also useful for translation projects
				</div>
			</div>
		</div>
	
		<div class="panel" id="tabsPreview">
			<h1>Previewer</h1>
			Show preview interview
		</div>
		<div class="panel" id="tabsUpload">
			
	<div class="tabHeader">Publish/Upload <button CSH="Publish" class="CSH"/></div> 
			<p>To publish your interview to another site such as LHI, download the ZIP which contains the interview and its supplemental files.
			 </p>
		<button id="guideZIP">Download ZIP</button>
		<button id="guideDownload">Download A2J</button>
		<button id="guidePublish">Publish to Public URL</button>
		<button id="guideMobile">Test Mobile</button>
		
		</div>
	</div>
	<div id="cajaheader"><span id="cajainfo" title="About this Authoring System"></span>
	<div class="authorver"></div>
	<div class="authorenv"></div><span id="guidetitle"></span>
		<button id="settings"/>
	</div>
	<div id="cajafooter"><span id="saveStatus"></span><span id="CAJAStatus"></span>
		<span class="copyright">
			© 2000-2015 Illinois Institute of Technology - Chicago-Kent College of Law and the Center for Computer-Assisted Legal Instruction
	</span> </div>
</div>
<div class="hidestart">
	<div id="xedit-plain-form" title="Edit" class="">
		<form>
			<fieldset>
			<textarea name="text"  class="text ui-widget-content ui-corner-all" ></textarea>
			</fieldset>
		</form>
	</div>
	<div id="page-picker-dialog" title="Pick a destination page" class="">
		<form>
			<div id="page-picker-list" class="pageoutline pagelist">
			</div>
		</form>
	</div>
	<div class="page-edit-form">
		<div class="page-edit-form-panel"></div>
	</div>
	<div id="var-edit-form" title="Variable">
		<form class="editq">
			<fieldset>
			<div>
				<label for="varname">Name:</label>
				<span class="editspan">
				<input type="text" name="varname" id="varname" class="editable text ui-widget-content ui-corner-all"  />
				</span></div>
			<div>
				<label for="vartype">Type:</label>
				<span class="editspan">
				<select name="vartype" id="vartype" class="editable">
					<option value="Unknown">Unknown</option>
					<option value="Text">Text</option>
					<option value="TF">TF - True/False</option>
					<option value="Number">Number</option>
					<option value="Date">Date</option>
					<option value="MC">Multiple choice</option>
					<option value="Other">Other</option>
				</select>
				</span></div>
			<div>
				<label for="varrepeating">Repeating:</label> 
					<span class="editspan">
					<input type="checkbox" name="varrepeating" id="varrepeating">Check if multiple values
				</span>
			</div>
			<div>
				<label for="varcomment">Comment:</label>
				<span class="editspan">
				<input type="textarea" name="varcomment" id="varcomment" class="editable taller text ui-widget-content ui-corner-all"  />
				</span></div>
			<div>
				<label for="varusage">Used by:</label>
				<input type="button" name="varusage" id="varusage" />
			</div>
			<div>
				<div id="varUsageList"></div>
			</div>
			</fieldset>
		</form>
	</div>
	
	<div id="clause-edit-form" title="Clause">
		<div class="editq">
			<div id=clausefs></div>
			<fieldset>
			<div>
				<label for="clauseusage">Used by:</label>
				<input type="button" name="clauseusage" id="clauseusage" />
			</div>
			<div>
				<div id="clauseUsageList"></div>
			</div>
			</fieldset>
		</div>
	</div>
<div id="settings-form" title="Settings">
	<ul id="cajasettings">
		<li>General
			<ul>
				<li>Color Schemes
					<ul>
						<li  class="ui-state-disabled"> A2J 5</li>
					</ul>
				</li>
				<li>Data Settings
					<ul>
						<li>
							<input type=checkbox id="setting_warnHotDocsNameLength"  >
							Warn when variable name lengths are too long for HotDocs</li>
					</ul>
				</li>
				<li>Text Statistics
					<ul>
						<li>Flesh-Kincaid and more
							<ul>
								<li>
									<input  type="checkbox" id="setting_FKGradeAll"/>
									Include grade numbers for good text</li>
							</ul>
						</li>
					</ul>
				</li>
			</ul>
		<li>Advanced 
			<ul> 
				<li  >
					<input   type=checkbox id="setting_showJS"  >
					Show JS</li>
			</ul>
	</ul>
</div>
	
<div id="dialog-form-var-val-edit" title="Change value">
<form>
<fieldset>
<label for="value">Value</label>
<input type="text" name="value" id="var-value" class="text ui-widget-content ui-corner-all">
</fieldset>
</form>
</div>

	<div id="xviewer-logic-form" title="Viewer logic" class="ViewerLogicForm">
		<div class="tracepanel">
			<ul id="tracer">
			</ul>
		</div>
		<div class="immediatepanel">
			<input type="text" id="tracerimm"/>
		</div>
	</div>
	<div id="xviewer-var-form" title="Viewer Variables" class="ViewerVarForm"></div>
	<div id="texttoolbar" class="texttoolbar ui-widget-header ui-corner-all">
		<button id="bold">bold</button>
		<button id="italic">italic</button>
		<button id="indent">indent</button>
		<button id="outdent">outdent</button>
		<button id="link">link</button>
		<button id="popup">popup</button>
	</div>
	<div id="welcome" title="Welcome to Access to Justice Author (v5)">
		<div class="tabContentFrame">
			<div class="tabContent ">
				<p class="name"></p>
				<p>What would you like to do? </p>
				<div id="guidelist">
				</div>
			</div>
		</div>
	</div>
	<div id="dialog_window_minimized_container"></div>
	<div id="dialog-confirm" title=""></div>
	<div id="login-form" title="Access To Justice 5">
		Please sign in at <a href="http://a2j02.a2jauthor.org">A2J Author.org</a>.
	</div>
</div>
</div>
</body>
</html>
