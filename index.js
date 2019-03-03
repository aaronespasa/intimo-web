const express = require("express");
const path = require('path');
const app = express();

const routes = require('./routes/index');

//Settings
app.set('port', process.env.PORT || 3000); //Declare a variable 'port' and asign it a configuration
app.set('views', path.join(__dirname, 'views')); //define where's the views folder
app.set('view engine', 'ejs'); //Configure the template engine

//Middlewares
app.use((req, res, next) => {
    console.log(`${req.url} -${req.method}`);
    next();
});
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Routes
app.use(routes);//Use the routes of the routes folder

//Static Files
app.use(express.static(path.join(__dirname, 'public')));

//Start the server
app.listen(app.get('port'), () => {
    console.log(`Server listening on port ${app.get('port')}`);
});