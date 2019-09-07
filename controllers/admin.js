const { join } = require('path');
const { unlinkSync } = require('fs');
const Product = require('../models/Products');
const { SESS_NAME } = require('../index');

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
    const items = await Product.find().sort({ created_at: -1 });
    res.render('admin/dashboard-layout', {
      title: 'Íntimo: Admin',
      items,
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
    const item = await Product.findById(req.params.id);
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
    const { path } = await Product.findByIdAndDelete(id);
    const fullPath = join(`${__dirname}/../public/${path}`);
    unlinkSync(fullPath, (err) => {
      err && console.error(err);
    });
    res.redirect('/admin');
  }
};

ctrl.uploadProduct = async (req, res) => {
  const product = new Product();

  product.name = req.body.name;
  product.description = req.body.description;
  product.sex = req.body.sex;
  product.age = req.body.age;
  product.type = req.body.type;
  product.filename = req.file.filename;
  product.path = `/images/products/${req.file.filename}`;
  product.originalname = req.file.originalname;
  console.log(product);

  await product.save();

  res.redirect('/admin');
};

ctrl.updateProduct = async (req, res) => {
  const product = req.body;
  await Product.findByIdAndUpdate(req.params.id, {
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

module.exports = ctrl;
