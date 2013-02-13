echo 2/2013 Minifying CAJA's .js and .css files using google closure compiler.
set JAR=../../../js/closure/compiler.jar
REM set LEVEL=WHITESPACE_ONLY
set LEVEL=SIMPLE_OPTIMIZATIONS
REM DO NOT USE : set LEVEL=ADVANCED_OPTIMIZATIONS
set OPTIONS=--warning_level VERBOSE --compilation_level %LEVEL% --summary_detail_level 3
REM java -jar %JAR% --help > closure_help.txt 2>&1
:start
REM Merge/minify .js files required for A2J Viewer 
java -jar %JAR% --externs externs.js --externs externs_viewer.js --js CAJA_Utils.js --js CAJA_Languages.js --js CAJA_Types.js --js CAJA_Parser.js --js CAJA_Parser_A2J.js  --js CAJA_Viewer_A2J.js --js CAJA_Shared.js   --js CAJA_Logic.js   --js A2JViewer.js %OPTIONS% --js_output_file A2JViewer_min.js > A2JViewer_log.txt 2>&1
REM Merge/minify .js files required for A2J Author
java -jar %JAR% --externs externs.js  --js CAJA_Utils.js --js CAJA_Languages.js --js CAJA_Types.js --js CAJA_Parser.js --js CAJA_Parser_A2J.js  --js CAJA_Viewer_A2J.js --js CAJA_Shared.js --js CAJA_Mapper.js --js CAJA_Logic.js --js CAJA_Author.js --js CAJA_Dev.js %OPTIONS% --js_output_file A2JAuthor_min.js > A2JAuthor_log.txt 2>&1
REM 
pause
REM Loop when developing...
goto start
pause
