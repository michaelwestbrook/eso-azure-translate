const rimraf = require("rimraf");
const esoTranslate = require('./index');

function cleanTranslatedStrings() {
	return new Promise(resolve => rimraf('./strings/translated', resolve));
}

// beforeEach(cleanTranslatedStrings);

// afterAll(cleanTranslatedStrings);

test('Strings are translated from English', () => {
	const en = {
		"STRING1": "Some text"
	};

	return esoTranslate.translateEnglishString(process.env['AzureTranslatorKey'], "key1", "value 1", {}, {},)
		.then(console.log);
});

test('Multiple line strings are collapsed to a single line', () => {
	throw "not tested";
});

test('Strings are overridden in translated files', () => {
	throw "not tested";
})