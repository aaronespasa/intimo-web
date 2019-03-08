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
    }
];

const home = (req, res) => {
    res.render('index.ejs', {
        title: "Íntimo"
    }); //We've had said where is index.ejs in the settings
}

const productosMujer = (req, res, next) => {
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

const contacto = (req, res, next) => {
    res.render('../views/contacto.ejs', {
        title: "Íntimo: Contacto"
    })
}

const newProduct = (req, res, next) => {
    res.render('newProduct');
}

const uploadProduct = async (req, res) => {
    const product = new Product();

    product.name = req.body.name;
    product.description = req.body.description;
    product.sex = req.body.sex;
    product.age = req.body.age;
    product.type = req.body.type;
    product.filename = req.file.filename;
    product.path = '/img/products' + req.file.filename;
    product.originalname = req.file.originalname;

    await product.save();

    res.send('Producto creado+');
}

module.exports = {
    home, //Is the same as -> home: home
    productosMujer,
    productosHombre,
    productosNinos,
    productosCasa,
    contacto,
    newProduct,
    uploadProduct
}