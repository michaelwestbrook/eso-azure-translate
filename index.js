const translate = require('./translate');

function translateEnglishString(accessKey, key, value, frenchOverrides, germanOverrides) {
  return new Promise((resolve) => {
    // Translate to French and German
    return translate(accessKey, value)
      .then(response => {
        const json = JSON.parse(response);
        // Collate results
        const translations = {
          fr: frenchOverrides.hasOwnProperty(key) ? { text: frenchOverrides[key] } : json[0].translations.find(element => element.to == "fr"),
          de: germanOverrides.hasOwnProperty(key) ? { text: germanOverrides[key] } : json[0].translations.find(element => element.to == "de"),
          en: { text: value, to: 'en' }
        };
        resolve({ key: key, translations: translations });
      });
  })
}

function generateZosTranslationFileContent(translations) {
  const fileContent = {}
  for (var translation in translations) {
    const key = translations[translation].key;
    Object.keys(translations[translation].translations).forEach(lang => {
      fileContent[lang] = fileContent[lang] == null ? "" : fileContent[lang];
      fileContent[lang] += `ZO_CreateStringId("${key}", "${translations[translation].translations[lang].text}")\n`
    });
  }

  return fileContent;
}

function writeZosLocalizationFile(lang, fileContent, directory) {
  const fse = require('fs-extra');
  const path = `${directory}/${lang}.lua`;
  return fse.ensureFile(path)
    .then(() => fse.writeFile(path, fileContent));
}

// Translates from English to French and German.
function translateEnglishStrings(accessKey, en, fr, de, destinationDirectory) {
  return Promise.all(Object.keys(en).map(key => translateEnglishString(accessKey, key, en[key], fr, de)))
    .then(generateZosTranslationFileContent)
    .then(fileContent => Object.keys(fileContent).map(lang => writeZosLocalizationFile(lang, fileContent[lang], destinationDirectory)))
    .then(promises => Promise.all(promises));
}

module.exports.translateEnglishStrings = translateEnglishStrings;
module.exports.translateEnglishString = translateEnglishString;
module.exports.generateZosTranslationFileContent = generateZosTranslationFileContent;
module.exports.writeZosLocalizationFile = writeZosLocalizationFile;