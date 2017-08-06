start:
	yarn start

build: clean
	yarn build

deploy: build
	firebase deploy --only hosting

clean:
	rm -rf build/
