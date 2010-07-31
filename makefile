# Skookum JS + CSS deployment makefile
# v.1.0
#
# "Compiles" *.js recursively in JS_DIR -> JS_DIR/compressed.js
# Compresses CSS_SOURCES in listed order -> CSS_DIR/compressed.css
# 
# hunter@skookum.com


# Configure these per-project

JS_DIR = ./static/js/
CSS_DIR = ./static/css/

# Since stylesheets cascade, order is important
CSS_SOURCES = reset-min.css smoothness/jquery-ui-1.8.2.custom.css jquery.ui.tooltip.css app.css buttons.css

GOOGLE_CLOSURE = ../build_tools/closure_compiler.jar
YUI_COMPRESSOR = ../build_tools/yuicompressor-2.4.2.jar


# Leave these alone unless you want to relocate the compressed files

JS_TARGET = ${JS_DIR}compressed.js
CSS_TARGET = ${CSS_DIR}compressed.css


.PHONY: all js css

all: js css

js:
	java -jar ${GOOGLE_CLOSURE} --js $(find ${JS_DIR} -name '*.js') --js_output_file ${JS_TARGET}

css: ${CSS_SOURCES}
	cat $^ | java -jar ${YUI_COMPRESSOR} --type css > ${CSS_TARGET}
