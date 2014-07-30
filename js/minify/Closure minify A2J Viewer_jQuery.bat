@echo off
echo 2/2013 Minifying CAJA's .js and .css files using google closure compiler.
rem 8/2013
set JAR=../../../../js/closure/compiler.jar
REM set LEVEL=WHITESPACE_ONLY
set LEVEL=SIMPLE_OPTIMIZATIONS
REM DO NOT USE : set LEVEL=ADVANCED_OPTIMIZATIONS
set OPTIONS=--warning_level VERBOSE --compilation_level %LEVEL% --summary_detail_level 3 --charset UTF-8
:start
echo Merge/minify .js files required for A2J Viewer/jQuery
java -jar %JAR% --externs externs.js --externs externs_viewer.js --js ..\viewer\jquery.ui.traggable.js   --js ..\viewer\jquery.ui.combobox.js --js ..\viewer\A2J_Types.js --js ..\viewer\A2J_Prefs.js --js ..\viewer\A2J_Shared.js --js ..\viewer\A2J_SharedSus.js --js ..\viewer\A2J_Languages.js --js ..\viewer\A2J_Parser.js --js ..\viewer\A2J_Viewer.js --js ..\viewer\A2J_Logic.js --js ..\viewer\A2J_ViewerApp.js %OPTIONS% --js_output_file A2J_ViewerApp.min.raw.js > closure_minify_A2J_Viewer_log.log 2>&1
REM Open log file
closure_minify_a2j_viewer_log.log 
REM Copy raw min to correct path with copyright header.
goto header
echo {} > A2J_ViewerApp.min.raw.js
:header
copy/b  ..\viewer\jquery.1.8.2.min.js+..\viewer\jquery.xml.min.js+..\viewer\jshashtable-2.1.js+..\viewer\jquery.numberformatter-1.2.1.jsmin.js+..\viewer\jquery.ui.1.9.1.min.js+A2J_ViewerApp.min.raw.js A2J_ViewerApp.min.raw2.js
copy/b CAJA_min_header.js+A2J_ViewerApp.min.raw2.js ..\viewer\A2J_ViewerHost.js
REM Clear .js files so Komodo Edit doesn't confuse .js locations
del A2J_ViewerApp.min.raw.js
del A2J_ViewerApp.min.raw2.js
dir ..\viewer\A2J_ViewerApp.min.js
REM
REM echo Press key to run again...
REM pause
REM goto start
