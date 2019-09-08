const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema;

const commentSchema = new Schema({
    soft_id: {type: ObjectId},
    email: {type: String},
    name: {type: String},
    gravatar: {type: String},
    comment: {type: String},
    timestamp: {type: Date, default: Date.now}
});

module.exports = mongoose.model('comment', commentSchema);