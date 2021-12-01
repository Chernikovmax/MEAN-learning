const {postsPath} = require('./constants');
const {handleSave, handleGet, handleDelete, handleUpdate} = require('./utils/database');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');

const app = express();

mongoose.connect(
    'mongodb+srv://chernikovmax:DerjUds3@mean-learning.rgupq.mongodb.net/node-angular?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    .then(() => {
        console.log('Connected to DataBase!');
    })
    .catch(err => {
        console.error('Connection failed!', err.message);
    });
app.use(bodyParser.json());

app.use((req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    resp.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    resp.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, DELETE, PATCH, OPTIONS'
    );
    next();
});

app.get(postsPath, (req, resp) => {
    console.log(['New get request', req.body]);
    handleGet(Post, resp, 'Post added successfully');
});

app.post(postsPath, (req, resp) => {
    console.log(['New post request', req.body]);
    const {title, content} = req.body;
    const post = new Post({
        title,
        content
    });
    console.log('New post was created', post);
    handleSave(post, resp, {
        message: 'Post was successfully added',
        id: post._id
    });
});

app.delete(`${postsPath}/:id`, (req, resp) => {
    console.log(['New delete request', req.body]);
    const {id} = req.params;
    handleDelete(Post, resp, id);
});

app.patch(postsPath, (req, resp) => {
    console.log(['New patch request', req.body]);
    const post = req.body;
    handleUpdate(Post, resp, post.id,{title: post.title, content: post.content});
});

module.exports = app;
