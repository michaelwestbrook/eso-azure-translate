const translate = require("./translate");

function translateEnglishString(accessKey, key, value, frenchOverrides, germanOverrides) {
  return new Promise((resolve, reject) => {
    // Translate to French and German
    return translate(accessKey, value)
      .then(response => {
        const json = JSON.parse(response);
        if (json && json.error) {
          reject(json.error);
        } else {
          // Collate results
          const translations = {
            key: key,
            fr: frenchOverrides.hasOwnProperty(key) ? frenchOverrides[key] : json[0].translations.find(element => element.to == "fr").text,
            de: germanOverrides.hasOwnProperty(key) ? germanOverrides[key] : json[0].translations.find(element => element.to == "de").text,
            en: value
          };
          resolve(translations);
        }
      });
  });
}

function generateZosTranslationFileContent(translations) {
  const fileContent = { en: "", fr: "", de: "" };
  translations.forEach(translation => {
    fileContent.en += `ZO_CreateStringId("${translation.key}", "${translation.en}")\n`;
    fileContent.fr += `ZO_CreateStringId("${translation.key}", "${translation.fr}")\n`;
    fileContent.de += `ZO_CreateStringId("${translation.key}", "${translation.de}")\n`;
  });

  return fileContent;
}

// Translates from English to French and German.
function translateEnglishStrings(accessKey, en, fr, de, destinationDirectory) {
  const fs = require("fs");
  const path = require("path");
  return new Promise((resolve, reject) => {
    fs.exists(destinationDirectory, exists => {
      if (!exists) {
        fs.mkdir(destinationDirectory, { recursive: true }, error => {
          if (error) {
            reject(error);
          }

          resolve();
        })
      } else {
        resolve();
      }
    });
  })
    .then(() => Promise.all(Object.keys(en).map(key => translateEnglishString(accessKey, key, en[key], fr, de))))
    .then(generateZosTranslationFileContent)
    .then(fileContent => Object.keys(fileContent).map(lang => {
      const languageFile = `${destinationDirectory}/${lang}.lua`;
      return new Promise((resolve, reject) => {
        fs.writeFile(languageFile, fileContent[lang], { flag: 'w+' }, error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }))
    .then(promises => {
      return Promise.all(promises)
    });
}

module.exports.translateEnglishStrings = translateEnglishStrings;
module.exports.translateEnglishString = translateEnglishString;
module.exports.generateZosTranslationFileContent = generateZosTranslationFileContent;
