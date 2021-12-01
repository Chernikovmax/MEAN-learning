const {Schema, model} = require('mongoose');

const postSchema = Schema({
    title: {type: String, require: true},
    content: {type: String, require: true},
});

module.exports = model('Post', postSchema);
