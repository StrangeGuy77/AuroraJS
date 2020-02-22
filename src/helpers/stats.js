const Software = require('../models/software');
const Comment = require('../models/comment');


async function softwaresCounter(){
    return Software.countDocuments();
}

async function commentsCounter(){
    return await Comment.countDocuments();
}

async function softwareTotalViewsCounter(){
    const result = await Software.aggregate([{$group: {
        _id: '1',
        viewsTotal: {$sum: '$views'}
    }}]);
    return result[0].viewsTotal === undefined ? 0 : result[0].viewsTotal;
}

async function likesTotalCounter(){
    const result = await Software.aggregate([{$group: {
        _id: '1',
        likesTotal: {$sum: '$likes'}
    }}]);
    return result[0].likesTotal;
}

module.exports = async () => {
    const results = await Promise.all([
        softwaresCounter(),
        commentsCounter(),
        softwareTotalViewsCounter(),
        likesTotalCounter()
    ]);

    return {
        softwares: results[0],
        comments: results[1],
        views: results[2],
        likes: results[3]
    }

};
