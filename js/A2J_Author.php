﻿<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<!--
	CALI Author 5 / A2J Author 5 (CAJA)
	All Contents Copyright The Center for Computer-Assisted Legal Instruction
	04/15/2013
-->
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>A2J Author 5</title>
<link  xhref="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/themes/sunny/jquery-ui.css"  title="style" rel="stylesheet" type="text/css"/>
<link  xhref="http://code.jquery.com/ui/1.9.0/themes/sunny/jquery-ui.css" title="style"  rel="stylesheet" type="text/css"/>
<script xsrc="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
<script xsrc="http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js" type="text/javascript"></script>
<link title="style" href="themes/a2j/jquery-ui.css"  rel="stylesheet" type="text/css"/>
<link href="jquery.ui.custom.css" rel="stylesheet" type="text/css" />
<link href="A2J_Author.css"  rel="stylesheet" type="text/css"/>
<link href="A2J_Viewer.css"  rel="stylesheet" type="text/css"/>
<script src="jquery.1.8.2.min.js" type="text/javascript"></script>
<script src="jquery.ui.1.9.1.custom.min.js" type="text/javascript"></script>
<script src="jquery.ui.custom.min.js" type="text/javascript" ></script>


<script src="CAJA_Types.js" type="text/javascript"></script>
<script src="CAJA_Utils.js" type="text/javascript"></script>
<script src="CAJA_Languages.js" type="text/javascript"></script>
<script src="CAJA_Parser.js" type="text/javascript"></script>
<script src="CAJA_Parser_A2J.js" type="text/javascript"></script>
<script src="CAJA_Logic.js" type="text/javascript"></script>
<script src="CAJA_Shared.js" type="text/javascript"></script>
<script src="A2J_Mapper.js" type="text/javascript"></script>
<script src="A2J_Viewer.js" type="text/javascript"></script>
<script src="A2J_AuthorApp.js" type="text/javascript"></script>



<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body >
<div id="splash" class="welcome" onclick="signin();return false;">
	<div align="center"> <img src="img/A2J5_Icon_512.png"/> <img src="img/blank_guide2front.png"/> </div>
</div>
	
<div id="page-viewer" class="hidestart ViewerApp">
	<div class="testing">
		<div id="viewer-logic-form" class="ViewerLogicForm"><div class="tracepanel"><ol id="tracer" contentEditable="true"></ol></div><div class="immediatepanel"><span><input type="text" id="tracerimm"/></span></div></div>
		<div id="viewer-var-form" class="ViewerVarForm" ></div>
	</div>
	<div class="A2JViewer"></div>
</div>
	
	
<div id="authortool" class="hidestart">
	<div class="guideio">
		<button id="guideNew" />
		<button id="guideOpen" />
		<button id="guideSave" />
		<button id="guideSaveAs" />
		<button id="guideClose" />
	</div>
	<div class="guidemenu ui-state-default">
		<ul>
			<li ref="tabsAbout">About</a></li>
			<li ref="tabsVariables">Variables</a></li>
			<li ref="tabsSteps">Steps</a></li>
			<li ref="tabsPages">Pages</a></li>
			<li ref="tabsMap">Map</a></li>
			<li ref="tabsLogic">Logic</a></li>
			<li ref="tabsText">Text</a></li>
			<li ref="tabsReport">Report</a></li>
			<li ref="tabsPreview">Preview</a></li>
			<li ref="tabsUpload">Upload</a></li>
		</ul>
	</div>
	<div class="guidepanels">
		<div class="panel" id="tabsAbout">
			<div class="tabHeader">Information about this guide. </div>
			<div class="tabContentFrame">
				<div class="tabContent editq"></div>
			</div>
		</div>
		<div class="panel" id="tabsVariables">
			<div class="tabHeader">Variables used in this guide</div>
			<div class="tabContentFrame">
				<div class="tabContent editq"></div>
			</div>
			<div class="tabFooter">
				<button id="var-add">Add Variable</button>
			</div>
		</div>
		<div class="panel" id="tabsSteps">
			<div class="tabHeader">Steps</div>
			<div class="tabContentFrame">
				<div class="tabContent editq"></div>
			</div>
		</div>
		<div class="panel" id="tabsPages">		
			<div class="tabHeader">
				Double-click a page to edit. Select one or more to copy, delete or clone. 
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
					</div>
					</div>
		<!--<div id="tabsConstants">
					<div class="tabHeader"></div>
					<div class="tabContentFrame">
						<div class="tabContent editq"></div>
					</div>
				</div>
				-->
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
						<button zoom="fit"></button>
						<button zoom="1.25"></button>
						<button zoom="0.75"></button>
					</div>
				</div>
			</div>			 
		</div>
		<div class="panel" id="tabsLogic">
			<div class="tabHeader">
				<form>
					<div id="showlogic">
						<input checked="checked" type="radio" id="showlogic1" name="showlogic" />
						<label for="showlogic1">Show only active code</label>
						<input type="radio" id="showlogic2" name="showlogic" />
						<label for="showlogic2">Show all code blocks</label>
					</div>
				</form>
			</div>
			<div class="tabContentFrame">
				<div class="tabContent editq"></div>
			</div>
		</div>
		<div class="panel" id="tabsText">
			<div class="tabHeader">
				<form>
					<div id="showtext">
						<input checked="checked" type="radio" id="showtext1" name="showtext" />
						<label for="showtext1">Filled fields</label>
						<input type="radio" id="showtext2" name="showtext" />
						<label for="showtext2">All fields</label>
					</div>
				</form>
			</div>
			<div class="tabContentFrame">
				<div class="tabContent editq"></div>
			</div>
		</div>
		<div class="panel" id="tabsReport">
			<h1>Report</h1>
			Report of text in a print-friendly layout, also useful for translation projects</div>
		<div class="panel" id="tabsPreview">
			<h1>Previewer</h1>
			Show preview interview </div>
		<div class="panel" id="tabsUpload">
			<h1>Upload</h1>
			Option to upload to LHI would be here</div>
	</div>
	<div id="cajaheader"><span id="cajainfo" title="About this Authoring System"></span><span id="guidetitle"></span>
		<button id="settings"/>
	</div>
	<div id="cajafooter"><span id="CAJAStatus"></span><span style="float:right;text-align:right">All Contents &copy; CALI, The Center for Computer-Assisted Legal
		Instruction. All Rights Reserved.</span> </div>
</div>
<div class="hidestart">
	<div id="xedit-plain-form" title="Edit" class="">
		<form>
			<fieldset>
			<textarea name="text"  class="text ui-widget-content ui-corner-all" ></textarea>
			</fieldset>
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
					<option value="MC">Number</option>
					<option value="Date">Date</option>
					<option value="MC">Multiple choice</option>
					<option value="Other">Other</option>
				</select>
				</span></div>
			<div>
				<label for="varcomment">Comment:</label>
				<span class="editspan">
				<input type="textarea" name="varcomment" id="varcomment" class="editable taller text ui-widget-content ui-corner-all"  />
				</span></div>
			</fieldset>
		</form>
	</div>
	<div id="settings-form" title="Settings">
		<ul id="cajasettings">
			<li> <a href="#">Authoring Color Scheme</a>
				<ul>
					<li><a href="#theme">A2J</a></li>
					<li><a href="#theme">Smoothness</a></li>
					<li><a href="#theme">UI-Darkness</a></li>
					<li><a href="#theme">UI-Lightness</a></li>
					<li><a href="#theme">Sunny</a></li>
					<li><a href="#theme">Humanity</a></li>
					<li><a href="#theme">Redmond</a></li>
					<li><a href="#theme">Cupertino</a></li>
				</ul>
			</li>
			<li class="ui-state-disabled"><a href="#">Print...</a></li>
			<li>System Development tests (removed before final release)
				<ul>
					<li  > <a  >Sample Guides for Stress Testing</a>
						<ul id="samples">
						</ul>
					</li>
				</ul>
		</ul>
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
		<button id="link">link</button>
		<button id="popup">popup</button>
	</div>
	<div id="welcome" title="Welcome to Access to Justice Author (v5)">
		<div class="tabContentFrame">
			<div class="tabContent ">
				<p>What would you like to do? </p>
				<p>Create a new Guide</p>
				<p>Open an existing Guide</p>
				<p>Customize someone else's Guide</p>
			</div>
		</div>
	</div>
	<div id="dialog_window_minimized_container"></div>
	<div id="dialog-confirm" title=""></div>
	<div id="login-form" title="Access To Justice 5 Authoring System Sign in">
		<form>
			<fieldset>
			<label for="username">Name</label>
			<input type="text" name="name" id="username" class="text ui-widget-content ui-corner-all"  />
			<label for="userpass">Password</label>
			<input type="password" name="pass" id="userpass" class="text ui-widget-content ui-corner-all"   />
			</fieldset>
		</form>
	</div>
</div>
</div>
</body>
</html>
