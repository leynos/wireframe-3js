.PHONY: dev build
node_modules/.install-stamp: package.json package-lock.json
	npm ci
	touch $@

dev: node_modules/.install-stamp
	npm run dev

build: node_modules/.install-stamp
	npm run build
