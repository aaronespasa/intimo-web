const mongoose = require('mongoose')
const { Schema, model } = mongoose

const productSchema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  sex: { type: String, required: true },
  age: { type: String, required: true },
  type: { type: String, requires: true },
  // Image
  filename: { type: String, require },
  path: { type: String, required: true },
  originalname: { type: String, required: true },
  // Sizes: { type: Array, require: true },
  created_at: { type: Date, default: Date.now }
})

module.exports = model('Products', productSchema)
