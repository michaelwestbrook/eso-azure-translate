const rimraf = require("rimraf");
const esoTranslate = require('./index');

function translate() {
	const key = process.env['AzureTranslatorKey'];
	if (!key) {
		throw "Must set `AzureTranslatorKey` environment variable to use translation service";
	}

	const tran = require('./index');
	return esoTranslate.esoAzureTranslate(key, require('./strings/en.json'), require('./strings/fr.json'), require('./strings/de.json'), './strings/translated');
}

function cleanTranslatedStrings() {
	return new Promise(resolve => rimraf('./strings/translated', resolve));
}

beforeEach(cleanTranslatedStrings);

// afterAll(cleanTranslatedStrings);

test('Strings are translated from English', () => {
	const en = {
		"STRING1": "Some text"
	};

	return esoTranslate.translateEnglishString(process.env['AzureTranslatorKey'], "STRING1", en, {}, {}, './strings/translated')
		.then(console.log);
});

test('Multiple line strings are collapsed to a single line', () => {
	throw "not tested";
});

test('Strings are overridden in translated files', () => {
	throw "not tested";
})