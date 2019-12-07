const express = require("express");
const { json, urlencoded, static } = require("express")
const { join, extname } = require("path")
const morgan = require("morgan")
const multer = require("multer");
const { diskStorage } = require("multer") 
const uuid = require("uuid/v4")
const session = require("express-session");
const SessionStore = require("connect-mongo")(session);
const exphbs = require("express-handlebars") // Template engine middleware
const { config } = require('./config/index');

/*
 * Inicializations
 */
const app = express()
const db = require("./database").connection

/*
 * Settings
 */
const routes = require("./routes/index")
//const db = mongoose.connection;
console.log(db);

app.set("port", config.port); //Sets the server port with the value of thee .env file
app.set("views", join(__dirname, "views")); // Define where's the views folder
app.engine(".hbs", exphbs({
    defaultLayout: "main", //Sets the main layout file
    layoutsDir: join(app.get("views"), "layouts"), //Set the folder with the layout files
    partialsDir: join(app.get("views"), "partials"), //Sets the folder with partial files
    extname: ".hbs", //Sets the ext name of the view engine
    helpers: require("./helpers/handlebars") //Sets the file with the hbs helpers
  })
);
app.set("view engine", ".hbs"); // Configure the template engine
const TIME = 1000 * 60 * 60 * 2;
const {
  NODE_ENV = "development",
  SESS_LIFETIME = TIME,
  SESS_NAME = "sid",
  SESS_SECRET = "ssh!quiet, it'a secret"
} = process.env;
const IN_PROD = NODE_ENV === "production";

/*
 * Middlewars
 */
if (config.dev) {
  app.use(morgan("dev")); //:status token -> Red: server error codes, Yellow: client error codes, Cyan: redirection codes
}
app.use(json());
app.use(urlencoded({ extended: true }));

// @destination defines where the file should be stored
// @filename is composed of a generated uuid and the extension of the original file
const storage = diskStorage({
  destination: join(__dirname, "public/images/products"),
  filename: (req, file, cb) => {
    cb(null, uuid() + extname(file.originalname));
  }
});
// Only store images
app.use(multer({ storage: storage }).single("image")); //Allows for images uploading
app.use(
  session({
    name: SESS_NAME,
    store: new SessionStore({ mongooseConnection: db }),
    resave: false,
    saveUninitialized: true,
    secret: SESS_SECRET
  })
);
//Routes
app.use(routes); //Use the routes of the routes folder

//static Files
app.use(static(join(__dirname, "public"))); //Sets the public folder

//Start the server
app.listen(app.get("port"), () => { //Starts the server
  console.log(`Server listening on port ${app.get("port")}`);
});
