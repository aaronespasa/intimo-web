const mongoose = require('mongoose');
const { Schema, model} = mongoose;

User = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true}
});

module.exports = model('User', User);