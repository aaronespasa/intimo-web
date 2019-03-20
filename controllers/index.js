const Product = require('../models/Products');

const items = [
    {
        id: 1,
        name: 'product1'
    },
    {
        id: 2,
        name: 'product2'
    },
    {
        id: 3,
        name: 'product3'
    },
    {
        id: 4,
        name: 'product4'
    }
];

const home = (req, res) => {
    res.render('index.ejs', {
        title: "Íntimo"
    }); //We've had said where is index.ejs in the settings
}

const productosMujer = (req, res) => {
    res.render('productos-mujer', {
        title: 'Íntimo: Productos',
        items: items
    })
}

const productosHombre = (req, res, next) => {
    res.render('productos-hombre', {
        title: 'Íntimo: Productos',
        items: items
    })
}


const productosNinos = (req, res, next) => {
    res.render('productos-ninos', {
        title: 'Íntimo: Productos',
        items: items
    })
}

const productosCasa = (req, res, next) => {
    res.render('productos-casa', {
        title: 'Íntimo: Productos',
        items: items
    })
}

const admin = (req, res, next) => {
    res.render('../views/admin.ejs', {
        title: "Admin"
    })
}

const newProduct = (req, res, next) => {
    res.render('newProduct', {
        title: "Íntimo: Crear Producto"
    });
}

const uploadProduct = async (req, res) => {
    const product = new Product();

    product.name = req.body.name;
    product.description = req.body.description;
    product.sex = req.body.sex;
    product.age = req.body.age;
    product.type = req.body.type;
    product.filename = req.file.filename;
    product.path = '/images/products' + req.file.filename;
    product.originalname = req.file.originalname;

    await product.save();

    res.send('/admin/nuevo');
}

module.exports = {
    home, //Is the same as -> home: home
    productosMujer,
    productosHombre,
    productosNinos,
    productosCasa,
    admin,
    newProduct,
    uploadProduct
}