const { join } = require('path');
const { unlinkSync } = require('fs');
const ProductModel = require('../models/Products');
const { SESS_NAME } = require('../index');
const { jsonReader, jsonWriter } = require('../helpers/helpers');

const users = [
  { id: 1, email: 'adri@adri.com', password: '1234' },
  { id: 2, email: 'aaron@aaron.com', password: '2345' },
  { id: 3, email: 'monica@monica.com', password: '3456' },
];

const ctrl = {};

//* ****************************
// ADMIN
//* ****************************

ctrl.admin = async (req, res) => {
  if (!req.session.adminId) {
    res.redirect('/admin/signin');
  } else {
    const items = await ProductModel.find().sort({ created_at: -1 }).limit(3);
    const config = await jsonReader('./config/config.json'); // Uses the json reader helper to get config data
    const ids = config.config.featured_id; // Gets the ids of the featured products
    const featuredItems = [];
    for (let i = 0; i < ids.length; i += 1) {
    // The data of the featured products are searched on the DB using the ids saved in config.json
    const featuredItem = await ProductModel.findById(ids[i]);
    featuredItems.push(featuredItem);
  }  
    res.render('admin/dashboard-layout', {
      title: 'Íntimo: Admin',
      items,
      featuredItems,
      admin: true,
      adminDashboard: true,
    });
  }
};

ctrl.signin = (req, res) => {
  if (req.session.adminId) {
    res.redirect('/admin');
  } else {
    res.render('admin/signin', {
      title: 'Login',
      admin: true,
    });
  }
};

ctrl.login = (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = users.find(
      (user) => user.email === email && user.password === password,
    );

    if (user) {
      req.session.adminId = user.id;
      res.redirect('/admin');
    } else {
      res.redirect('/admin/signin');
    }
  }
};

ctrl.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/admin');
    }
    res.clearCookie(SESS_NAME);
    res.redirect('/');
  });
};

ctrl.newProduct = (req, res) => {
  if (!req.session.adminId) {
    res.redirect('/admin/signin');
  } else {
    res.render('admin/dashboard-layout', {
      title: 'Íntimo: Crear Producto',
      admin: true,
      newProduct: true,
    });
  }
};

ctrl.editProduct = async (req, res) => {
  if (!req.session.adminId) {
    res.redirect('/admin/signin');
  } else {
    const item = await ProductModel.findById(req.params.id);
    res.render('admin/editProduct', {
      title: 'Íntimo: Editar Producto',
      item,
      admin: true,
    });
  }
};

ctrl.deleteProduct = async (req, res) => {
  if (!req.session.adminId) {
    res.redirect('/admin/signin');
  } else {
    const { id } = req.params;
    const { path } = await ProductModel.findByIdAndDelete(id);
    const config = await jsonReader('./config/config.json');
    const fullPath = join(`${__dirname}/../public/${path}`);
    unlinkSync(fullPath, (err) => {
      err && console.error(err);
    });
    if (config.config.featured_id.includes(id)) {
      config.config.featured_id.splice(config.config.featured_id.indexOf(id), 1);
      await jsonWriter('./config/config.json', config);
    }
    res.redirect('/admin');
  }
};

ctrl.uploadProduct = async (req, res) => {
  const product = new ProductModel();

  product.name = req.body.name;
  product.description = req.body.description;
  product.sex = req.body.sex;
  product.age = req.body.age;
  product.type = req.body.type;
  product.defaultPrice = req.body.price; 
  product.filename = req.file.filename;
  product.path = `/images/products/${req.file.filename}`;
  product.originalname = req.file.originalname;
  await product.save();

  res.redirect('/admin');
};

ctrl.updateProduct = async (req, res) => {
  const product = req.body;
  await ProductModel.findByIdAndUpdate(req.params.id, {
    name: product.name,
    description: product.description,
    sex: product.sex,
    age: product.age,
    type: product.type,
    filename: req.file.filename,
    path: `/images/products/${req.file.filename}`,
    originalname: req.file.originalname,
  });
  res.redirect('/admin');
};

ctrl.addPrdToFeatured = async (req, res) => {
  const config = await jsonReader('./config/config.json');
  const errors = []
  if (config.config.featured_id.length >= 4) {
    errors.push('El numero máximo de productos destacados es 4');
  }
  if (config.config.featured_id.includes(req.params.id)) {
    errors.push('Ese producto ya se encuentra en la lista de destacados');
  }
  if (errors.length > 0) {
    res.redirect('/admin');
  }
  if (errors.length === 0) {
    config.config.featured_id.push(req.params.id);
    await jsonWriter('./config/config.json', config);
    res.redirect('/admin');
  }
}

ctrl.removePrdFromFeatured = async (req, res) => {
  const config = await jsonReader('./config/config.json');
  const errors = []
  if (!config.config.featured_id.includes(req.params.id)) {
    errors.push('Ese producto no se encuentra en la lista de destacados');
  }
  if (errors.length > 0) {
    res.redirect('/admin');
  }
  if (errors.length === 0) {
    config.config.featured_id.splice(config.config.featured_id.indexOf(req.params.id), 1);
    await jsonWriter('./config/config.json', config);
    res.redirect('/admin');
  }
}
module.exports = ctrl;
