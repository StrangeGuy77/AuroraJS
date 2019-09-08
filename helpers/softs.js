const Software = require('../models/software');

module.exports = {
    async popular(){
        const softwares = await Software.find()
        .limit(3)
        .sort({likes: -1});
        return softwares;
    }
}