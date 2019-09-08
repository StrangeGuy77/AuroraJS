const Software = require('../models/software');
const Comment = require('../models/comment');

module.exports = {
    async newest(){
        const comments = await Comment.find()
        .limit(5)
        .sort({timestamp: -1});

        for(const comment of comments){
            const soft = Software.findOne({_id: comment.soft_id});
            comment.soft = soft;
        }

        return comments;
    }
}