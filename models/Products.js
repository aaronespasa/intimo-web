const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productSchema = new Schema({
    name: { type: String, require: true },
    description: { type: String, require: true },
    sex: { type: String, required: true},
    age: { type: String, required: true },
    type: {type: String, requires: true},
    //imagen
<<<<<<< HEAD
    filename: { type: String, require}, 
    path: {type: String, required: true},
    originalname: { type: String, required: true },
    //sizes: { type: Array, require: true },
    created_at: { type: Date, default: Date.now }
=======
    filename: { type: String, require},
    path: {type: String, required: true},
    originalname: { type: String, required: true }
    //sizes: { type: Array, require: true },
>>>>>>> 40f8b69bde0d5dd6c3e8bff4b982aa123102810b
});

module.exports = model('Products', productSchema);