const translate = require('./translate');

function translateEnglishString(accessKey, key, value, frenchOverrides, germanOverrides) {
  return new Promise((resolve, reject) => {
    // Translate to French and German
    return translate(accessKey, value)
      .then(response => {
        const json = JSON.parse(response);
        if (json && json["error"]) {
          reject(respose.error);
        }
        // Collate results
        const translations = {
          fr: frenchOverrides.hasOwnProperty(key) ? frenchOverrides[key] : json[0].translations.find(element => element.to == "fr").text,
          de: germanOverrides.hasOwnProperty(key) ? germanOverrides[key] : json[0].translations.find(element => element.to == "de").text,
          en: value
        };
        const translation = new Object();
        translation[key] = translations;
        resolve(translation);
      })
      .catch(reject);
  })
}

function generateZosTranslationFileContent(translations) {
  const fileContent = { en: {}, fr: {}, de: {} };
  for (let key in translations) {
    fileContent.en[key] = `ZO_CreateStringId("${key}", "${translations[key].en}")\n`;
    fileContent.fr[key] = `ZO_CreateStringId("${key}", "${translations[key].fr}")\n`;
    fileContent.de[key] = `ZO_CreateStringId("${key}", "${translations[key].de}")\n`;
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
