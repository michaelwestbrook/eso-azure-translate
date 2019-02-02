const rimraf = require("rimraf");
const esoTranslate = require("../index");

const destinationDirectory = "./test/translated";

function cleanTranslatedStrings() {
	return new Promise(resolve => rimraf(destinationDirectory, resolve));
}

function basicAssertTranslateAssert(translation) {
	expect(translation).not.toBeUndefined();
	expect(translation.key).not.toBeUndefined();
	expect(translation.fr).not.toBeUndefined();
	expect(translation.de).not.toBeUndefined();
	expect(translation.en).not.toBeUndefined();
	return translation;
}

beforeEach(cleanTranslatedStrings);

afterAll(cleanTranslatedStrings);

describe("Translate string", () => {
	test("Strings are translated from English", () => {
		return esoTranslate.translateEnglishString(process.env["AzureTranslatorKey"], "key1", "value 1", {}, {})
			.then(basicAssertTranslateAssert);
	});

	test("Strings are overridden when provided", () => {
		return esoTranslate.translateEnglishString(process.env["AzureTranslatorKey"], "key1", "value 1", { "key1": "Custom French Value" }, { "key1": "Custom German Value" })
			.then(basicAssertTranslateAssert)
			.then(translation => {
				expect(translation.key).toBe("key1");
				expect(translation.fr).toBe("Custom French Value");
				expect(translation.de).toBe("Custom German Value");
				// expect(translation.en).toBe("value 1");
			});
	});
});

test("Translation fails if invalid access key provided", () => expect(esoTranslate.translateEnglishString("foo", "key1", "value 1", {}, {})).rejects.toThrowError());

test("E2E", () => {
	return esoTranslate.translateEnglishStrings(process.env["AzureTranslatorKey"], { "key1": "Value 1", "key2": "Value 2" }, {}, {}, destinationDirectory);
});
