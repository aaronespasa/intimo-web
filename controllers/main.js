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
  if (req.session.userId) {
    logged = true;
  }
  const config = await jsonReader('./config/config.json'); // Uses the json reader helper to get config data
  const ids = config.config.featured_id; // Gets the ids of the featured products
  const featuredItems = [];
  for (let i = 0; i < ids.length; i += 1) {
    // The data of the featured products are searched on the DB using the ids saved in config.json
    const featuredItem = await ProductModel.findById(ids[i]);
    featuredItems.push(featuredItem);
  }  
  const newItems = await ProductModel.find().sort({ created_at: -1 }).limit(3)
  res.render('main/frontpage', {
    logged,
    title: 'Ìntimo',
    newItems,
    featuredItems,
    admin: false,
    url: "/"
  }); // We've had said where is index.hbs in the settings
};

//*******************************
//Products
//*******************************
ctrl.products = async (req, res) => {
  let logged = false;
  if (req.session.userId) {
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
    query.name = { $regex: req.query.search, $options: 'i' }
  }
  if (req.query.sex) {
    query.sex = req.query.sex;
  }  
  const items = await ProductModel.find(query).sort({ created_at: -1 });
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
  if (req.session.userId) {
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
  if (!req.session.userId) {
    res.redirect('/login?origin=/wishlist')
  } else {
    logged = true;
  }
  const user = await UserModel.findById(req.session.userId);
  console.log(user.wishList);
  
  const items = []
  for (let i = 0; i < user.wishList.length; i++) {    
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
  if (req.session.userId) {
    res.redirect('/');
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
  if (req.session.userId) {
    res.redirect('/');
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
  const {id} = req.params;
  const {wishList} = await UserModel.findById(req.session.userId)
  const errors = []
  if (config.config.featured_id.length >= 25) {
    errors.push('El numero máximo de productos destacados es 25');
  }
  if (wishList.includes(req.params.id)) {
    errors.push('Ese producto ya se encuentra en la lista de deseos');
  }
  if (errors.length > 0) {
    res.redirect(`/products/view/${id}`);
  }
  if (errors.length === 0) {
    wishList.push(id);
    await UserModel.findByIdAndUpdate(req.session.userId, {wishList}, {new: true});
    res.redirect('/wishlist');
  }
}

//*******************************
//Remove product from wishlist
//*******************************
ctrl.removeFromWishList = async (req, res) => {
  const {id} = req.params;
  const {wishList} = await UserModel.findById(req.session.userId)
  const errors = []
  if (!wishList.includes(req.params.id)) {
    errors.push('Ese producto no se encuentra en la lista de deseos');
  }
  if (errors.length > 0) {
    res.redirect('/wishlist');
  }
  if (errors.length === 0) {
    wishList.splice(wishList.indexOf(id), 1);
    await UserModel.findByIdAndUpdate(req.session.userId, {wishList}, {new: true});
    res.redirect('/wishlist');
  }
  
}

//*******************************
//Signup
//*******************************
ctrl.signup = async (req, res) => {
  const { name, email, password, repeatPassword } = req.body;
  const users = await UserModel.find({ email });
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
    const hash = await passHasher(password);
    const newUser = new UserModel({
      name,
      email,
      password: hash,
    });
    await newUser.save();
    res.redirect(req.query.origin);
  }
  // res.render('main/signup', {
  //   title: `Íntimo | Registrarse`,
  // });
};

//*******************************
//Login
//*******************************
ctrl.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const errors = [];
  if (!user) {
    errors.push('No existe ningun usuario con ese correo electronico, crea una cuenta si no lo hiciste');
    res.redirect(`/login?origin=${req.query.origin}`);
  } else {
    const pass = await passChecker(password, user.password);
    if (!pass) {
      errors.push('La contraseña es incorrecta');
      res.redirect('/login');
    } else {
      // eslint-disable-next-line no-underscore-dangle
      req.session.userId = user._id;
      res.redirect(req.query.origin);
    }
  }
  // res.render('main/signin', {
  //   title: `Íntimo | Iniciar sesión`,
  // });
};

//*******************************
//Logout
//*******************************
ctrl.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect(req.query.origin);
    }
    res.clearCookie(SESS_NAME);
    res.redirect(req.query.origin);
  });
};

module.exports = ctrl;
