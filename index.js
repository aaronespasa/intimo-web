const express = require("express")
const { json, urlencoded, static } = require("express")
const { join, extname } = require("path")
const morgan = require("morgan")
const multer = require("multer");
const { diskStorage } = require("multer") 
const uuid = require("uuid/v4")
const session = require("express-session")
const exphbs = require("express-handlebars") // Template engine middleware

/*
 * Inicializations
 */
const app = express()
require("./database")

/*
 * Settings
 */
const routes = require("./routes/index")

app.set("port", process.env.PORT || 3000);
// Define where's the views folder
app.set("views", join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: join(app.get("views"), "layouts"),
    partialsDir: join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./helpers/handlebars")
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
app.use(morgan("dev")); //:status token -> Red: server error codes, Yellow: client error codes, Cyan: redirection codes
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
app.use(multer({ storage: storage }).single("image"));
app.use(
  session({
    name: SESS_NAME,
    resave: true,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
      secure: IN_PROD
    }
  })
);

//Routes
app.use(routes); //Use the routes of the routes folder

//static Files
app.use(static(join(__dirname, "public")));

//Start the server
app.listen(app.get("port"), () => {
  console.log(`Server listening on port ${app.get("port")}`);
});
