const express = require("express"), //Makes easier to create a server
      path = require('path'), //Provides utilities for working with file and directory paths
      morgan = require('morgan'), //HTTP request logger middleware
      multer = require('multer'), //Multer is a middleware which is primarily used for uploading files
      uuid = require('uuid/v4'), //Fast-generation of Universally Unique IDentifier (UUID)
      session = require('express-session'), //Simple session middleware for Express
      exphbs = require('express-handlebars'); //Template engine middleware
      
//Inicializations
 app = express();
require('./database');

//Settings
const routes = require('./routes/index');
app.set('port', process.env.PORT || 3000); //Find if there is a variable 'PORT', else the port is 3000
app.set('views', path.join(__dirname, 'views')); //Define where's the views folder
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./helpers/handlebars')
  }));
app.set('view engine', '.hbs'); //Configure the template engine
const TIME = 1000*60*60*2;
const {
    NODE_ENV = 'development',
    SESS_LIFETIME = TIME,
    SESS_NAME = 'sid',
    SESS_SECRET = 'ssh!quiet, it\'a secret',
} = process.env;
const IN_PROD = NODE_ENV === 'production';
//Middlewares
app.use(morgan('dev'));//:status token -> Red: server error codes, Yellow: client error codes, Cyan: redirection codes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Destination defines where the file should be stored
//Filename is composed of a generated uuid and the extension of the original file
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/images/products'),
    filename: (req, file, cb, filename) => {
        cb(null, uuid() + path.extname(file.originalname));
    }
})
app.use(multer({ storage: storage }).single('image'));//Storage: Where to store the files; .single: Only allows 'image'
app.use(session({
    name: SESS_NAME,
    resave: true,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}))

//Routes
app.use(routes);//Use the routes of the routes folder

//Static Files
app.use(express.static(path.join(__dirname, 'public')));

//Start the server
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});
