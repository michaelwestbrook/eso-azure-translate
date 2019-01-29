const rimraf = require("rimraf");
const esoTranslate = require('../index');

function cleanTranslatedStrings() {
	return new Promise(resolve => rimraf('./strings/translated', resolve));
}

function basicAssertTranslateAssert(translation) {
	expect(translation).not.toBeUndefined();
	expect(Object.keys(translation).length).toBe(1);
	expect(translation["key1"]).not.toBeUndefined();
	expect(translation["key1"].fr).not.toBeUndefined();
	expect(translation["key1"].de).not.toBeUndefined();
	expect(translation["key1"].en).not.toBeUndefined();
	expect(translation["key1"].en).toBe("value 1");
	return translation;
}

beforeEach(cleanTranslatedStrings);

afterAll(cleanTranslatedStrings);

test('Strings are translated from English', () => {
	return esoTranslate.translateEnglishString(process.env['AzureTranslatorKey'], "key1", "value 1", {}, {})
		.then(basicAssertTranslateAssert);
});

test('Strings are overridden when provided', () => {
	return esoTranslate.translateEnglishString(process.env['AzureTranslatorKey'], "key1", "value 1", { "key1": "Custom French Value" }, { "key1": "Custom German Value" })
		.then(basicAssertTranslateAssert)
		.then(translation => {
			expect(translation["key1"].fr).toBe("Custom French Value");
			expect(translation["key1"].de).toBe("Custom German Value");
		});
});

test('Translation fails if invalid access key provided', () => {
	return expect(esoTranslate.translateEnglishString('foo', "key1", "value 1", {}, {})).rejects.toThrowError();
});

test('E2E', () => {
	return esoTranslate.translateEnglishStrings(process.env["AzureTranslatorKey"], { "key1": "Value 1", "key2": "Value 2" }, {}, {}, './strings/translations')
		.then(console.log);
});
