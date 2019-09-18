const { DefaultLocale } = require('../keys');

const translateModule = {};

translateModule.getDefaultLanguage = () => {
    return DefaultLocale.defaultLanguage;
}

translateModule.setDefaultLanguage = languageToSet => {
    DefaultLocale.defaultLanguage = languageToSet;
}

translateModule.getJSONlanguageToTranslate = jsonName => {

    if (jsonName === "") {
        jsonName = this.getDefaultLanguage();
    }

    let toTranslateJSON = require(`../locales/${jsonName}.json`);
    toTranslateJSON.CurrentLanguage = jsonName;
    return toTranslateJSON;
}

module.exports = translateModule;