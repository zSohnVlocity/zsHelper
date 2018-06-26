# VARIABLES
PATH  					:= node_modules/.bin:$(PATH)
BROWSERIFY 				:= browserify
UGLIFYJS 				:= uglifyjs
UGLIFYJS_ARGS 			:= --compress
YARN 					:= yarn
YARN_ARGS				:= --silent --pure-lockfile --ignore-optional --production=false --non-interactive
.DEFAULT_GOAL 			:= deploy

# PHONY
deploy: all
ifneq (,$?)
	git push
else
	@echo No Change
endif

all: Makefile \
	dist/zsHelper.min.js \
	dist/*

yarn: node_modules package.json
ifneq (,$(findstring B,$(MAKEFLAGS)))
	@$(YARN) $(YARN_ARGS) install
endif

watch:
	while true; do make -s -q || make -s; sleep 0.5; done

.PHONY: yarn all deploy watch

# EXPLICIT TARGETS
dist/zsHelper.js: src/main.js| yarn Makefile
	$(BROWSERIFY) $< > $@

# IMPLICIT TARGETS
%.min.js: %.js
	@$(UGLIFYJS) $(UGLIFYJS_ARGS) --comments --  $< > $@
