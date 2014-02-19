@echo off
echo 2/2013 Minifying CAJA's .js and .css files using google closure compiler.
rem 8/2013
set JAR=../../../../js/closure/compiler.jar
REM set LEVEL=WHITESPACE_ONLY
set LEVEL=SIMPLE_OPTIMIZATIONS
REM DO NOT USE : set LEVEL=ADVANCED_OPTIMIZATIONS
set OPTIONS=--warning_level VERBOSE --compilation_level %LEVEL% --summary_detail_level 3 --charset UTF-8
REM java -jar %JAR% --help > closure_help.txt 2>&1
:start

echo Merge/minify .js files required for A2J Viewer 
java -jar %JAR% --externs externs.js --externs externs_viewer.js --js ..\viewer\A2J_Types.js --js ..\viewer\A2J_Shared.js --js ..\viewer\A2J_SharedSus.js --js ..\viewer\A2J_Languages.js --js ..\viewer\A2J_Parser.js --js ..\viewer\A2J_Viewer.js --js ..\viewer\A2J_Logic.js --js ..\viewer\A2J_ViewerApp.js %OPTIONS% --js_output_file A2J_ViewerApp.min.raw.js > closure_minify_A2J_Viewer_log.log 2>&1
REM java -jar %JAR% --externs externs.js --externs externs_viewer.js --js ..\CAJA_Utils.js --js ..\CAJA_IO.js --js ..\CAJA_Languages.js --js ..\CAJA_Types.js --js ..\CAJA_Parser.js --js ..\CAJA_Parser_A2J.js  --js ..\A2J_Viewer.js --js ..\CAJA_Shared.js --js ..\CAJA_Logic.js --js ..\A2J_ViewerApp.js %OPTIONS% --js_output_file A2J_ViewerApp.min.raw.js > closure_minify_A2J_Viewer_log.log 2>&1
REM Open log file
closure_minify_a2j_viewer_log.log 
REM Copy raw min to correct path with copyright header.
echo {} > A2J_ViewerApp.min.raw.js
copy/b CAJA_min_header.js+A2J_ViewerApp.min.raw.js ..\viewer\A2J_ViewerApp.min.js
REM Clear .js files so Komodo Edit doesn't confuse .js locations
del A2J_ViewerApp.min.raw.js
dir ..\viewer\A2J_ViewerApp.min.js
REM
REM echo Press key to run again...
REM pause
REM goto start
