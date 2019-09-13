const moment = require('moment');
const { DefaultLocale } = require('../keys');
const helpers = {};

helpers.timeago = timestamp => {
    return moment(timestamp).startOf('minute').fromNow();
};

helpers.languageFinder = () => {
    return DefaultLocale.preferedUserLanguage;
}

module.exports = helpers;