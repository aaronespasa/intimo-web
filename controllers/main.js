const { jsonReader, passHasher, passChecker } = require('../helpers/helpers');
const { SESS_NAME } = require('../index');
const ProductModel = require('../models/Products');
const UserModel = require('../models/User');

const ctrl = {};

//*******************************
//*******************************
//*******************************
// HOMEPAGE, WISHLIST & PRODUCTS
//*******************************
//*******************************
//*******************************

//*******************************
//*******************************
//GET METHODS
//*******************************
//*******************************

//*******************************
//Frontpage
//*******************************
ctrl.home = async (req, res) => {
  let logged = false;
  if (req.session.userId) { //Checks if the user is logged
    logged = true;
  }
  const config = await jsonReader('./config/Config.json'); //Uses the json reader helper to get config data
  const ids = config.config.featured_id; //Gets the ids of the featured products
  const featuredItems = [];
  for (let i = 0; i < ids.length; i += 1) {
    //The data of the featured products are searched on the DB using the ids saved in Config.json
    const featuredItem = await ProductModel.findById(ids[i]);
    featuredItems.push(featuredItem);
  }  
  const newItems = await ProductModel.find().sort({ created_at: -1 }).limit(3) //Limits the 'new products' list to 3 items
  res.render('main/frontpage', {
    logged,
    title: 'Ìntimo',
    newItems,
    featuredItems,
    admin: false,
    url: "/"
  });
};

//*******************************
//Products
//*******************************
ctrl.products = async (req, res) => {
  let logged = false;
  if (req.session.userId) { //Checks if the user is logged
    logged = true;
  }
  // eslint-disable-next-line no-console
  let query = {}
  let url;
  if (Object.keys(req.query).length === 0 && req.query.constructor === Object) { //Checks if the query object is empty
    url = "/products"
  } else {
    var parameters = [];
    for (var property in req.query) {
      if (req.query.hasOwnProperty(property)) {
        parameters.push(encodeURI(property + '=' + req.query[property]));
      }
    }
    url = `/products?${parameters.join('&')}` //Transforms the query object into an url string
  }
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' } //Sets the search query to be used in the db
  }
  if (req.query.sex) {
    query.sex = req.query.sex; 
  }  
  const items = await ProductModel.find(query).sort({ created_at: -1 }); //Search the items in the db
  // if (!req.query.filter) {
  //   items = await ProductModel.find().sort({ created_at: -1 });
  // } else {
  //   items = await ProductModel.find({
  //     sex: req.query.filter.sex || 'unisex',
  //   }).sort({ created_at: -1 });
  // }
  res.render('main/productos', {
    title: 'Ìntimo | Productos',
    items,
    admin: false,
    logged,
    url
  });
};

//*******************************
//Product View
//*******************************
ctrl.viewProduct = async (req, res) => {
  let logged = false;
  if (req.session.userId) { //Checks if the user is logged
    logged = true;
  }
  const { id, name, description, onOffer, offerPrice, defaultPrice, path } = await ProductModel.findById(req.params.id);
  res.render('main/viewProduct', {
    title: `Ìntimo | ${name}`,
    id,
    name,
    description,
    onOffer,
    offerPrice,
    defaultPrice,
    path,
    admin: false,
    logged,
    url: `/products/view/${id}`
  });
};

//*******************************
//Wishlist
//*******************************
ctrl.wishlist = async (req, res) => {
  let logged = false;
  if (!req.session.userId) { //Checks if the user is logged
    res.redirect('/login?origin=/wishlist') //Redirects to login if user is not logged
  } else {
    logged = true;
  }
  const user = await UserModel.findById(req.session.userId); //Gets the user info from the db
  const items = []
  for (let i = 0; i < user.wishList.length; i++) {
    //The data of the featured products are searched on the DB using the ids saved in Config.json
    items.push(await ProductModel.findById(user.wishList[i]));
  }
  res.render('main/wishlist', {
    title: `Ìntimo | Lista de Deseos`,
    admin: false,
    logged,
    user: user.name,
    items,
    url: `/wishlist`
  });
}

//*******************************
//Signup
//*******************************
ctrl.register = (req, res) => {
  let logged = false;
  if (req.session.userId) {//Checks if the user is logged
    res.redirect('/'); //If it is, redirects to main page
  }
  res.render('main/signup', {
    title: 'Ìntimo | Crear Cuenta',
    admin: false,
    logged,
    url: req.query.origin
  })
}

//*******************************
//Login
//*******************************
ctrl.signin = (req, res) => {
  let logged = false;
  if (req.session.userId) { //Checks if the user is logged
    res.redirect('/'); //If it is, redirects to main page
  }
  res.render('main/signin', {
    title: 'Ìntimo | Iniciar Sesión',
    admin: false,
    logged,
    url: req.query.origin
  })
}

//*******************************
//*******************************
//POST METHODS
//*******************************
//*******************************

//*******************************
//Add product to wishlist
//*******************************
ctrl.addToWishList = async (req, res) => {
  const {id} = req.params; //Gets the product id from url params
  const {wishList} = await UserModel.findById(req.session.userId); //Gets the user wishlist from db
  console.log(wishList.length);
  
  const errors = []
  if (wishList.length >= 25) {
    errors.push('El numero máximo de productos destacados es 25');
  }
  if (wishList.includes(req.params.id)) {
    errors.push('Ese producto ya se encuentra en la lista de deseos');
  }
  if (errors.length > 0) {
    res.redirect(`/products/view/${id}`);
  }
  if (errors.length === 0) {
    wishList.push(id); //Pushes the item id to wishlist array
    await UserModel.findByIdAndUpdate(req.session.userId, {wishList}, {new: true}); //Updates the user's wishlist and adds the new item
    res.redirect('/wishlist');
  }
}

//*******************************
//Remove product from wishlist
//*******************************
ctrl.removeFromWishList = async (req, res) => {
  const {id} = req.params; //Gets the product id from url params
  const {wishList} = await UserModel.findById(req.session.userId); //Gets the user wishlist from db
  const errors = []
  if (!wishList.includes(req.params.id)) {
    errors.push('Ese producto no se encuentra en la lista de deseos');
  }
  if (errors.length > 0) {
    res.redirect('/wishlist');
  }
  if (errors.length === 0) {
    wishList.splice(wishList.indexOf(id), 1);  //Removes the item id from wishlist array
    await UserModel.findByIdAndUpdate(req.session.userId, {wishList}, {new: true});  //Updates the user's wishlist and removes the item
    res.redirect('/wishlist');
  }
  
}

//*******************************
//Signup
//*******************************
ctrl.signup = async (req, res) => {
  const { name, email, password, repeatPassword } = req.body; //Gets the user info from url body
  const users = await UserModel.find({ email }); //Search existing users using the sended email
  const errors = [];
  if (users.length > 0) {
    errors.push('Este correo electronico ya esta en uso, usa otro o inicia sesion');
  }
  if (password.length < 4) {
    errors.push('La contraseña debe tener al menos 4 caracteres');
  }
  if (password !== repeatPassword) {
    errors.push('Las contraseñas no coinciden');
  }
  if (errors.length > 0) {
    res.redirect(`/signup?origin=${req.query.origin}`);
  } else {
    const hash = await passHasher(password); //Hashes the password with the script in helper file
    const newUser = new UserModel({ //Creates a new user using the user model
      name,
      email,
      password: hash,
    });
    await newUser.save(); //Saves the new user in db
    res.redirect(req.query.origin);
  }
};

//*******************************
//Login
//*******************************
ctrl.login = async (req, res) => {
  const { email, password } = req.body; //Gets the user info from url body
  const user = await UserModel.findOne({ email }); //Search existing users using the sended email
  const errors = [];
  if (!user) {
    errors.push('No existe ningun usuario con ese correo electronico, crea una cuenta si no lo hiciste');
    res.redirect(`/login?origin=${req.query.origin}`);
  } else {
    const pass = await passChecker(password, user.password); //Hashes the password an compares it with hashed user's password in db
    if (!pass) {
      errors.push('La contraseña es incorrecta');
      res.redirect('/login');
    } else {
      // eslint-disable-next-line no-underscore-dangle
      req.session.userId = user._id; //Assigns the user id to session id
      res.redirect(req.query.origin);
    }
  }
};

//*******************************
//Logout
//*******************************
ctrl.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect(req.query.origin);
    }
    res.clearCookie(SESS_NAME); //Destroys the session cookie
    res.redirect(req.query.origin);
  });
};
module.exports = ctrl;