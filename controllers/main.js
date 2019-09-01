// const Product = require('../models/Products')

const ctrl = {}

//* ****************************
// HOME && PRODUCTS
//* ****************************

const products = [
  {
    _id: '5d52ef178a194e3398ed4258',
    created_at: '2019-08-13T17:10:47.223Z',
    name: 'Sujetador',
    description: 'Un buen sujetador',
    sex: 'woman',
    age: 'adulto',
    type: 'lenceria',
    filename: 'fb845711-1c0f-419b-b6be-71eb8b6ac4c7.jpg',
    path: '/images/products/fb845711-1c0f-419b-b6be-71eb8b6ac4c7.jpg',
    originalname: 'sujetador.jpg'
  },
  {
    _id: '5d52ef6dc4cd5017ec4c610f',
    created_at: '2019-08-13T17:12:13.661Z',
    name: 'Calzoncillo',
    description: 'Un buen calzón',
    sex: 'man',
    age: 'adulto',
    type: 'lenceria',
    filename: '33929450-1bd1-4218-adbc-58916b52ee7c.jpg',
    path: '/images/products/33929450-1bd1-4218-adbc-58916b52ee7c.jpg',
    originalname: 'calzoncillos.jpg'
  },
  {
    _id: '5d52ef92c4cd5017ec4c6110',
    created_at: '2019-08-13T17:12:50.850Z',
    name: 'Pijamote morenote',
    description: 'Un apasionante pijama',
    sex: 'woman',
    age: 'niño',
    type: 'pijama',
    filename: '41e59553-df04-4553-ba7e-7a6fc2000f67.jpg',
    path: '/images/products/41e59553-df04-4553-ba7e-7a6fc2000f67.jpg',
    originalname: 'pijama.jpg'
  }
]

ctrl.home = (req, res) => {
  res.render('main/frontpage', {
    title: 'Íntimo',
    items: products,
    admin: false
  })
}

ctrl.products = async (req, res) => {
  // var items;
  // if (req.params.filter === 'all') {
  //     items = await Product.find().sort({ created_at: -1 });
  // }
  // else {
  //     items = await Product.find({ sex: req.params.filter || 'unisex' }).sort({ created_at: -1 });
  // }
  res.render('main/productos', {
    title: 'Íntimo: Productos',
    items: products,
    admin: false
  })
}

ctrl.viewProduct = async (req, res) => {
  let item
  products.forEach(function (product) {
    if (product._id === req.params.id) {
      item = product
    }
  })
  res.render('main/viewProduct', {
    title: 'Íntimo: Producto',
    item: item,
    admin: false
  })
}

module.exports = ctrl
