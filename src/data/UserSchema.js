const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    accountname: {
		type: String,
		unique: true,
		immutable: true,
		required: [true, 'Username is required']
    },
    password: {
		type: String,
		required: [true, 'Password is required']
    },
    salt: {
		type: String,
		required: [true, 'Salt is required']
    },
    hash: {
		type: String,
		required: [true, 'Hash is required']
    },
    created: {
      type: Date,
      default: Date.now,
      required: [true, 'Created date is required']
    }
})

module.exports = mongoose.model('user', UserSchema);
