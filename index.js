const express = require("express");
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const uuid = require('uuid/v4');

const routes = require('./routes/index');
//Inicializations
const app = express();
require('./database');

//Settings
app.set('port', process.env.PORT || 3000); //Declare a variable 'port' and asign it a configuration
app.set('views', path.join(__dirname, 'views')); //define where's the views folder
app.set('view engine', 'ejs'); //Configure the template engine

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
//Routes
app.use(routes);//Use the routes of the routes folder

//Static Files
app.use(express.static(path.join(__dirname, 'public')));

//Start the server
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});