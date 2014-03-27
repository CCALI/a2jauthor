@echo off
echo 2/2013 Minifying custom and extra jQuery .js using google closure compiler.
rem 8/2013
set JAR=../../../../js/closure/compiler.jar
REM set LEVEL=WHITESPACE_ONLY
set LEVEL=SIMPLE_OPTIMIZATIONS
REM DO NOT USE : set LEVEL=ADVANCED_OPTIMIZATIONS
REM 
set OPTIONS=--warning_level QUIET  --compilation_level %LEVEL% --summary_detail_level 3 --charset UTF-8
:start
REM Merge/minify .js files required for A2J Author and A2J Viewer
java -jar %JAR% --externs externs.js --js ..\viewer\jquery.xml.min.js  --js ..\viewer\jquery.ui.combobox.js --js ..\viewer\jquery.ui.traggable.js %OPTIONS% --js_output_file ../viewer/jquery.custom.min.raw.js > closure_minify_viewer_jQuery_log.log 2>&1
java -jar %JAR% --externs externs.js --js ..\author\jquery.fileupload.js --js ..\author\jquery.fileupload-process.js --js ..\author\jquery.fileupload-validate.js  %OPTIONS% --js_output_file ../author/jquery.custom.min.raw.js > closure_minify_author_jQuery_log.log 2>&1
closure_minify_viewer_jquery_log.log
closure_minify_author_jquery_log.log
copy/b CAJA_min_header.js + ..\author\jquery.custom.min.raw.js ..\author\jquery.custom.min.js
copy/b CAJA_min_header.js + ..\viewer\jquery.custom.min.raw.js ..\viewer\jquery.custom.min.js
del ..\viewer\jquery.custom.min.raw.js
del ..\author\jquery.custom.min.raw.js
dir ..\viewer\jquery.custom.min.js 
dir ..\author\jquery.custom.min.js 
REM
REM pause
