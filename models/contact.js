const mongoose = require('mongoose');
const { Schema } = mongoose

const contactSchema = new Schema({
    
});

module.exports = mongoose.model('contact-user', contactSchema);