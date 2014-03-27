
BINS = node_modules/.bin
RM ?= rm -f
JS = $(wildcard lib/*/*.js)
META = component.json $(wildcard lib/*/component.json)

# build the entire extension
bundles: node_modules components bundles/manifest.json $(JS)
	@$(BINS)/component-bundle $(BUILD_FLAGS) --use autorequire

# install component dependencies
components: $(META)
	@$(BINS)/component-install $(INSTALL_FLAGS)

# copy over the manifest
bundles/manifest.json: manifest.json
	@mkdir -p bundles
	@cp $^ $@

node_modules: package.json
	@npm install

# remove built stuff
clean:
	$(RM) -r components bundles

.PHONY: clean
