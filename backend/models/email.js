const {Schema, model} = require('mongoose');

const emailSchema = Schema({
    recipients: {type: [String], require: true},
    theme: {type: String, require: true},
    content: {type: String, require: false},
});

module.exports = model('Email', emailSchema);
