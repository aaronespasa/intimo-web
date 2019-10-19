const mongoose = require('mongoose') // Defines objects with a strong typed diagram which is asigned to MongoDB document

const { config } = require('./config/index');

const DBUSER = encodeURIComponent(config.dbUser);
const DBPASSWORD = encodeURIComponent(config.dbPassword);
const DBHOST = encodeURIComponent(config.dbHost);
const DBNAME = encodeURIComponent(config.dbName);

mongoose.connect(`mongodb+srv://${DBUSER}:${DBPASSWORD}@${DBHOST}/${DBNAME}?retryWrites=true&w=majority`, {
  useFindAndModify: false, // Use `findOneAndUpdate()`
  useCreateIndex: true, // Use createIndex() instead of ensureIndex()
  useNewUrlParser: true // Rewrote the tool it uses to parse MongoDB connection strings
})
  .then(_ => console.log('DB is connected'))
  .catch(err => console.error(err))
