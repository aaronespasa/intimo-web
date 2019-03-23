const express = require("express");
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const uuid = require('uuid/v4');
const session = require('express-session');
const bodyParser = require('body-parser');

const routes = require('./routes/index');
//Inicializations
const app = express();
require('./database');

//Settings
app.set('port', process.env.PORT || 3000); //Declare a variable 'port' and asign it a configuration
app.set('views', path.join(__dirname, 'views')); //define where's the views folder
app.set('view engine', 'ejs'); //Configure the template engine
const TIME = 1000*60*2;
const {
    NODE_ENV = 'development',
    SESS_LIFETIME = TIME,
    SESS_NAME = 'sid',
    SESS_SECRET = 'ssh!quiet, it\'asecret',
} = process.env;
const IN_PROD = NODE_ENV === 'production';

//Middlewares
app.use(morgan('dev'));
app.use((req, res, next) => {
    console.log(`${req.url} -${req.method}`);
    next();
});
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/images/products'),
    filename: (req, file, cb, filename) => {
        cb(null, uuid() + path.extname(file.originalname));
    }
})
app.use(multer({ storage: storage }).single('image'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    name: SESS_NAME,
    resave: false,
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
