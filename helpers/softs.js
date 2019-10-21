const Software = require('../models/software');

module.exports = {
    async popular(){
        return await Software.find()
            .limit(3)
            .sort({likes: -1});
    }
};
