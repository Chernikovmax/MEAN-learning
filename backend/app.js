const {postsPath, emailSchedulePath} = require('./constants');
const {handleSave, handleGet, handleDelete, handleUpdate} = require('./utils/database');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/post');
const Email = require('./models/email');

const app = express();

mongoose.connect('mongodb+srv://chernikovmax:DerjUds3@mean-learning.rgupq.mongodb.net/node-angular?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to DataBase!');
    })
    .catch(err => {
        console.error('Connection failed!', err.message);
    });
app.use(bodyParser.json());

app.use((req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    resp.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    resp.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS');
    next();
});

app.get(postsPath, (req, resp) => {
    console.log(['New get request', req.body]);
    handleGet(Post, resp, 'Post added successfully');
});

app.post(postsPath, (req, resp) => {
    console.log(['New post request', req.body]);
    const {title, content} = req.body;
    const post = new Post({title, content});
    console.log('New post was created', post);
    handleSave(post, resp, {
        message: 'Post was successfully added', id: post._id
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
    handleUpdate(Post, resp, post.id, {title: post.title, content: post.content});
});


app.get(emailSchedulePath, (req, resp) => {
    console.log(['New get email schedules request', req.body]);
    Email.find()
        .then((data) => {
            console.log('Got email schedules from DB!');
            resp.status(200).json({emailSchedules: data});
        })
        .catch((err) => {
            console.error('Failed to get email schedules from DB!', err.message);
            resp.status(500).json({error: err});
        });
});


app.post(emailSchedulePath, (req, resp) => {
    console.log(['New email schedule post request', req.body]);
    const {recipients, theme, content} = req.body;
    const emailSchedule = new Email({
        recipients, theme, content
    });
    emailSchedule.save()
        .then(() => {
            console.log('New email schedule was created!');
            resp.status(201).json({id: emailSchedule._id});
        })
        .catch((err) => {
            console.error('Failed to save email schedule to DB!');
            resp.status(500).json({error: err});
        });
});

app.delete(`${emailSchedulePath}/:id`, (req, resp) => {
    console.log(['New delete email schedule request', req.body]);
    const {id} = req.params;
    Email.deleteOne({
        _id: id
    })
        .then(() => {
            const message = `Email schedule with id "${id}" was successfully deleted!`;
            console.log(message);
            resp.status(200).json({message,});
        })
        .catch((err) => {
            console.error(`Failed to delete email schedule with id "${id}"!`, err.message);
            resp.status(500).json({error: err});
        });
});

app.patch(emailSchedulePath, (req, resp) => {
    console.log(['New patch request', req.body]);
    const {recipients, theme, content, id} = req.body;
    Email.updateOne({
        _id: id
    }, {recipients, theme, content})
        .then(() => {
            const message = `Email schedule with id "${id}" was successfully updated!`;
            console.log(message);
            resp.status(200).json({message,});
        })
        .catch((err) => {
            console.error(`Failed to update email schedule with id "${id}"!`, err.message);
            resp.status(500).json({error: err});
        });
});

module.exports = app;
