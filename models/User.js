const mongoose = require('mongoose');
const { Schema, model} = mongoose;

User = new Schema({
    name: {type: String},
    email: { type: String, required: true },
    password: { type: String, required: true},
    wishList: {type: Array, default: []}
});

module.exports = model('Users', User);