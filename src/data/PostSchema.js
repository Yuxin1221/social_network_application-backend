const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    author: {
        type: String,
        required: [true, 'Author is required']
    },
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    content: {
        type: String,
        required: [true, 'Title is required']
    },
    image: {
        type: Buffer,
    },
    comment: {
        type: [{text: String, time: String}],
        required: [true, 'Comment is required']
    },
    created: {
        type: Date,
        default: Date.now,
        required: [true, 'Created date is required']
    }
})

module.exports = mongoose.model('post', PostSchema);
