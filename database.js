const mongoose = require('mongoose'); //Defines objects with a strong typed diagram which is asigned to MongoDB document

mongoose.connect('mongodb+srv://adrimr02:starTREK1966@proyectos-aukjk.mongodb.net/test?retryWrites=true', {
  useFindAndModify: false, //Use `findOneAndUpdate()`
  useCreateIndex: true, //Use createIndex() instead of ensureIndex()
  useNewUrlParser: true //Rewrote the tool it uses to parse MongoDB connection strings
})
  .then(db => console.log('DB is connected'))
  .catch(err => console.error(err));
