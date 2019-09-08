const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
    email: {type: String, default: 'noemail?@x.com'},
    issue: {type: String, default: 'noissue?'},
    content: {type: String, default: 'nocontent?'}
});

module.exports = mongoose.model('contact', contactSchema);