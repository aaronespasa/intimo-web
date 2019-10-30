const { jsonReader, passHasher, passChecker } = require('../helpers/helpers');
const { SESS_NAME } = require('../index');
const ProductModel = require('../models/Products');
const UserModel = require('../models/User');

const ctrl = {};

//* ****************************
// HOME && PRODUCTS
//* ****************************

// const products = [
//     { _id: '5d52ef178a194e3398ed4258',
//         created_at: '2019-08-13T17:10:47.223Z',
//         name: 'Sujetador',
//         description: 'Un buen sujetador',
//         sex: 'woman',
//         age: 'adulto',
//         type: 'lenceria',
//         filename: 'fb845711-1c0f-419b-b6be-71eb8b6ac4c7.jpg',
//         path: '/images/products/fb845711-1c0f-419b-b6be-71eb8b6ac4c7.jpg',
//         originalname: 'sujetador.jpg'
//     },
//     { _id: '5d52ef6dc4cd5017ec4c610f',
//         created_at: '2019-08-13T17:12:13.661Z',
//         name: 'Calzoncillo',
//         description: 'Un buen calzón',
//         sex: 'man',
//         age: 'adulto',
//         type: 'lenceria',
//         filename: '33929450-1bd1-4218-adbc-58916b52ee7c.jpg',
//         path: '/images/products/33929450-1bd1-4218-adbc-58916b52ee7c.jpg',
//         originalname: 'calzoncillos.jpg'
//     },
//     { _id: '5d52ef92c4cd5017ec4c6110',
//         created_at: '2019-08-13T17:12:50.850Z',
//         name: 'Pijamote morenote',
//         description: 'Un apasionante pijama',
//         sex: 'woman',
//         age: 'niño',
//         type: 'pijama',
//         filename: '41e59553-df04-4553-ba7e-7a6fc2000f67.jpg',
//         path: '/images/products/41e59553-df04-4553-ba7e-7a6fc2000f67.jpg',
//         originalname: 'pijama.jpg'
//     }
// ]

ctrl.home = async (req, res) => {
  let logged = false;
  if (req.session.userId) {
    logged = true;
  }
  const config = await jsonReader('./config/config.json'); // Uses the json reader helper

  const ids = config.config.featured_id; // Gets the ids of the featured products
  const items = [];
  for (let i = 0; i < ids.length; i += 1) {
    // The data of the featured products are searched on the DB using the ids saved in config.json
    const item = await ProductModel.findById(ids[i]);
    items.push(item);
  }
  // const items = products
  res.render('main/frontpage', {
    logged,
    title: 'Íntimo',
    items,
    admin: false,
  }); // We've had said where is index.hbs in the settings
};

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
    title: 'Íntimo | Productos',
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

ctrl.viewProduct = async (req, res) => {
  let logged = false;
  if (req.session.userId) {
    logged = true;
  }
  const item = await ProductModel.findById(req.params.id);
  // let item;
  // products.forEach(function (product) {
  //     if(product._id === req.params.id) {
  //         item = product
  //     }
  // });
  res.render('main/viewProduct', {
    title: `Íntimo | ${item.name}`,
    item,
    admin: false,
    logged,
  });
};

ctrl.signup = async (req, res) => {
  const { email, password, repeatPassword } = req.body;
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
    res.json(errors);
  } else {
    const hash = await passHasher(password);
    const newUser = new UserModel({
      email,
      password: hash,
    });
    await newUser.save();
    res.send('Usuario creado correctamente, inicia sesion');
  }
};

ctrl.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const errors = [];
  if (!user) {
    errors.push('No existe ningun usuario con ese correo electronico, crea una cuenta si no lo hiciste');
    res.json(errors);
  } else {
    const pass = await passChecker(password, user.password);
    if (!pass) {
      errors.push('La contraseña es incorrecta');
      res.json(errors);
    } else {
      // eslint-disable-next-line no-underscore-dangle
      req.session.userId = user._id;
      res.send('Sesion iniciada');
    }
  }
};

ctrl.logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie(SESS_NAME);
    res.json('sesion cerrada');
  });
};

module.exports = ctrl;
