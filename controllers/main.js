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
  if(req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' }
  }
  if(req.query.sex) {
    query.sex = req.query.sex;
  }
  console.log(query);
  
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
  });
};

// ctrl.productSearch = async (req, res) => {
//   let logged = false;
//   if (req.session.userId) {
//     logged = true;
//   }
//   const { search } = req.query;
//   const items = await ProductModel.find({ name: { $regex: search, $options: 'i' } });
//   res.render('main/productos', {
//     title: 'Íntimo | Productos',
//     items,
//     admin: false,
//     logged,
//   });
// };

//*******************************
//Product View
//*******************************
ctrl.viewProduct = async (req, res) => {
  let logged = false;
  if (req.session.userId) {
    logged = true;
  }
  const { id, name, description, onOffer, offerPrice, defaultPrice, path } = await ProductModel.findById(req.params.id);
  // let item;
  // products.forEach(function (product) {
  //     if(product._id === req.params.id) {
  //         item = product
  //     }
  // });
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
  });
};

//*******************************
//Wishlist
//*******************************
ctrl.wishlist = async (req, res) => {
  let logged = false;
  if (!req.session.userId) {
    res.redirect('/login')
  } else {
    logged = true;
  }
  const user = await UserModel.findById(req.session.userId);

  res.render('main/wishlist', {
    title: `Ìntimo | Lista de Deseos`,
    admin: false,
    logged,
    user: user.name,
    items: user.wishList
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
    logged
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
    logged
  })
}

//*******************************
//*******************************
//POST METHODS
//*******************************
//*******************************

//*******************************
//Signup
//*******************************
ctrl.signup = async (req, res) => {
  const { name, email, password, repeatPassword } = req.body;
  console.log(req.body);
  
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
    res.redirect('/signup');
  } else {
    const hash = await passHasher(password);
    const newUser = new UserModel({
      name,
      email,
      password: hash,
    });
    await newUser.save();
    res.redirect('/');
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
    res.redirect('/login');
  } else {
    const pass = await passChecker(password, user.password);
    if (!pass) {
      errors.push('La contraseña es incorrecta');
      res.redirect('/login');
    } else {
      // eslint-disable-next-line no-underscore-dangle
      req.session.userId = user._id;
      res.redirect('/');
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
      return res.redirect('/');
    }
    res.clearCookie(SESS_NAME);
    res.redirect('/');
  });
};

module.exports = ctrl;
