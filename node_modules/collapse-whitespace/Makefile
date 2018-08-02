babel := ./node_modules/.bin/babel
browserify := ./node_modules/.bin/browserify
uglify := ./node_modules/.bin/uglifyjs
standard := ./node_modules/.bin/standard

SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)

whitespace.min.js: $(LIB)
	$(browserify) lib/whitespace.js -s collapse | $(uglify) -m > $@

lib/%.js: src/%.js
	@mkdir -p $(@D)
	$(babel) --loose all $< -o $@

lint:
	$(standard) $(SRC)

test: whitespace.min.js
	@echo "Open test.html in your browser to run tests."

publish: whitespace.min.js $(LIB)
	npm publish

.PHONY: lint test publish
