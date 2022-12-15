const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    account: {
        type: String,
        required: [true, 'Account is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone is required']
    },
    birthdate: {
        type: Date,
        required: [true, 'Birth date is required']
    },
    zipcode: {
        type: String,
        required: [true, 'Zipcode is required']
    },
    headline: {
        type: String,
        required: [true, 'Headline is required']
    },
    avatar: {
        type: String,
        required: [true, 'Avatar URL is required']
    },
    follower: {
        type: [String],
        required: [true, 'Follower is required']
    },
    created: {
        type: Date,
        default: Date.now,
        required: [true, 'Created date is required']
    }
})

module.exports = mongoose.model('profile', ProfileSchema);