REM @echo off
echo 2/2013 Minifying custom and extra jQuery .js using google closure compiler.
rem 8/2013
set JAR=../../../../js/closure/compiler.jar
REM set LEVEL=WHITESPACE_ONLY
set LEVEL=SIMPLE_OPTIMIZATIONS
REM DO NOT USE : set LEVEL=ADVANCED_OPTIMIZATIONS
REM 
set OPTIONS=--warning_level QUIET  --compilation_level %LEVEL% --summary_detail_level 3 --charset UTF-8
:start
REM Merge/minify .js files required for A2J Author
java -jar %JAR% --externs externs.js --js ..\jQuery\jquery.xml.min.js --js ..\jQuery\jquery.fileupload.js --js ..\jQuery\jquery.fileupload-process.js --js ..\jQuery\jquery.fileupload-validate.js --js ..\jQuery\jquery.ui.combobox.js --js ..\jQuery\jquery.ui.traggable.js %OPTIONS% --js_output_file jquery.custom.min.raw.js > closure_minify_jQuery_log.log 2>&1
type closure_minify_jquery_log.log
copy/b CAJA_min_header.js + jquery.custom.min.raw.js ..\jQuery\jquery.custom.min.js
REM ..\jQuery\jquery.custom.min.js
REM del jquery.custom.min.raw.js
del jquery.custom.min.raw.js
dir ..\jQuery\jquery.custom.min.js 
REM
pause
