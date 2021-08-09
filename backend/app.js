const express = require('express');
const {postsPath, posts} = require('./constants');
const bodyParser = require('body-parser');

const app = express();

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
    resp.status(200).json({
        message: 'Post added successfully',
        posts
    });
});

app.post(postsPath, (req, resp) => {
    console.log(['New post request', req.body]);
    const post = req.body;
    console.log('New post was created', post);
    posts.push(post);
    resp.status(201).json({
        message: 'Post was successfully added',
        id: posts.length
    });
});

app.delete(postsPath, (req, resp) => {
    console.log(['New delete request', req.body]);
    const id = req.body.postId;
    console.log('ID:', id);
    posts.splice(posts.findIndex(p => p.id === id), 1);
    const message = `Post with id "${id}" was deleted`;
    console.log(message);
    resp.status(201).json({
        message,
    });
});

app.patch(postsPath, (req, resp) => {
    console.log(['New patch request', req.body]);
    const post = req.body;
    const storedPost = posts.find(p => p.id === post.id);
    if (!storedPost) {
        return resp.status(400).json({
            message: `Can't find post with id "${post.id}"`,
        });
    }
    console.log(JSON.parse(JSON.stringify(post)));

    Object.assign(storedPost, post);
    const message = `Post with id "${post.id}" was updated`;
    console.log(message);
    resp.status(201).json({
        message,
    });
});

module.exports = app;
