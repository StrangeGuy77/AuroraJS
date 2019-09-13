const Software = require('../models/software');

module.exports = {
    async popular(currentLanguage){
        let softwares = await Software.find()
        .limit(3)
        .sort({likes: -1});
        return softwares;
    }
}