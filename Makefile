PATH  					:= node_modules/.bin:$(PATH)
BROWSERIFY 				:= browserify
UGLIFYJS 				:= uglifyjs
UGLIFYJS_ARGS 			:= --compress
YARN 					:= yarn
YARN_ARGS				:= --silent --pure-lockfile --ignore-optional --production=false --non-interactive

yarn: node_modules package.json
	@$(YARN) $(YARN_ARGS) install

all: | Makefile \
	dist/zsHelper.min.js \
	dist/*

.PHONY: yarn all

dist/zsHelper.js: src/main.js| yarn
	$(BROWSERIFY) $< > $@

%.min.js: %.js
	@$(UGLIFYJS) $(UGLIFYJS_ARGS) --comments --  $< > $@