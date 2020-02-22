const Software = require('../models/software');
const Comment = require('../models/comment');

module.exports = {
    async newest(){

        let comments = await Comment.find()
        .limit(5)
        .sort({timestamp: -1});

        for(const comment of comments){
            comment.soft = await Software.findOne({_id: comment.soft_id});
        }

        return comments;
    }
};
