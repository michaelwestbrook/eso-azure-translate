const translate = require('./translate');

// Translates from English to French and German.
function esoAzureTranslate(accessKey, en, fr, de, destinationDirectory) {
  const promises = Object.keys(en).map(key => new Promise((resolve) => {
    // Translate to French and German
    return translate(accessKey, en[key])
      .then(response => {
        const json = JSON.parse(response);
        // Collate results
        const translations = {
          fr: fr.hasOwnProperty(key) ? { text: fr[key] } : json[0].translations.find(element => element.to == "fr"),
          de: de.hasOwnProperty(key) ? {text: de[key]} : json[0].translations.find(element => element.to == "de"),
          en: { text: en[key], to: 'en' }
        };
        resolve({ key: key, translations: translations });
      });
  }));

  return Promise.all(promises)
    .then(translations => {
      const fileContent = {}
      for (var translation in translations) {
        const key = translations[translation].key;
        Object.keys(translations[translation].translations).forEach(lang => {
          fileContent[lang] = fileContent[lang] == null ? "" : fileContent[lang];
          fileContent[lang] += `ZO_CreateStringId("${key}", "${translations[translation].translations[lang].text}")\n`
        });
      }
      return fileContent;
    })
    .then(fileContent => {
      const fse = require('fs-extra');
      return Object.keys(fileContent).map(lang => {
        const path = `${destinationDirectory}/${lang}.lua`;
        return fse.pathExists(path)
          .then(exists => {
            if (exists) {
              console.debug(`Deleting ${path}`);
              return fse.remove(path);
            }
          })
          .then(() => fse.writeFile(path, fileContent[lang]))
      });
    })
    .then(promises => Promise.all(promises));
}

module.exports = esoAzureTranslate