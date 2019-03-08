const mongoose = require('mongoose');

mongoose.connect('mongo://localhost:auth');
module.exports = mongoose;