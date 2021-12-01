function handleSave(schemaInstance, resp, body) {
    schemaInstance.save()
        .then(() => {
            console.log('Saved to DB!');
            resp.status(201).json(body);
        })
        .catch((err) => {
            console.error('Failed to save to DB!');
            resp.status(500).json({
                error: err
            }, err.message)
        });
}

exports.handleSave = handleSave;

function handleGet(schemaInstance, resp, message = null) {
    schemaInstance.find()
        .then((data) => {
            console.log('Got data from DB!');
            resp.status(200).json({
                message: message || 'Got data from DB!',
                data: data
            })
        })
        .catch((err) => {
            console.error('Failed to get data from DB!', err.message);
            resp.status(500).json({
                error: err
            })
        });
}

exports.handleGet = handleGet;

function handleDelete(schemaInstance, resp, id, message = null) {
    schemaInstance.deleteOne({
        _id: id
    })
        .then(() => {
            console.log(`Post with id "${id}" was successfully deleted!`);
            resp.status(200).json({
                message: message || `Post with id "${id}" was successfully deleted!`,
            })
        })
        .catch((err) => {
            console.error(`Failed to delete post with id "${id}"!`, err.message);
            resp.status(500).json({
                error: err
            })
        });
}

exports.handleDelete = handleDelete;

function handleUpdate(schemaInstance, resp, id, post) {
    schemaInstance.updateOne({
        _id: id
    }, post)
        .then(() => {
            console.log(`Post with id "${id}" was successfully updated!`);
            resp.status(200).json({
                message: `Post with id "${id}" was successfully updated!`,
            })
        })
        .catch((err) => {
            console.error(`Failed to update post with id "${id}"!`, err.message);
            resp.status(500).json({
                error: err
            })
        });
}

exports.handleUpdate = handleUpdate;
