const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productSchema = new Schema({
    name: { type: String, require: true },
    description: { type: String, require: true },
    sex: { type: String, required: true},
    age: { type: String, required: true },
    type: {type: String, requires: true},
    //imagen
    filename: { type: String, require},
    path: {type: String, required: true},
    originalname: { type: String, required: true }
    //sizes: { type: Array, require: true },
});

module.exports = model('Products', productSchema);