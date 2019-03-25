const bodyParser = require('body-parser');
const Product = require('../models/Products');
const SESS_NAME = require('../index').SESS_NAME;
const users = [
    { id: 1, email: 'adri@adri.com', password: '1234' },
    { id: 2, email: 'aaron@aaron.com', password: '2345' },
    { id: 3, email: 'monica@monica.com', password: '3456' }
]

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

//*****************************
//HOME && PRODUCTS
//*****************************

const home = (req, res) => {
    res.render('index', {
        title: "Íntimo"
    }); //We've had said where is index.ejs in the settings
}

const productos = (req, res) => {
    res.render('productos', {
        title: 'Íntimo: Productos',
        items: items
    })
}

//*****************************
//ADMIN
//*****************************

const admin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/admin/signin');
    } else {
        res.render('admin', {
            title: 'Admin'
        });
    }
    
}

const signin = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/admin/signin');
    } else {
        res.render('signin', {
            title: 'Login'
        })
    }    
}
    

const login = (req, res, next) => {
    const { email, password } = req.body;
    if (email && password) {
        const user = users.find(
            user => user.email === email && user.password === password
        );

        if (user) {
            req.session.userId = user.id;
            res.redirect('/admin');
        }
    }
}

const logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/admin');
        }
        res.clearCookie(SESS_NAME);
        res.redirect('/');
    })
}

const newProduct = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/admin/signin');
    } else {
        res.render('newProduct', {
            title: "Íntimo: Crear Producto"
        });
    }
}

const deleteProduct = (req, res, next) => {

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
    productos,
    admin,
    signin,
    login,
    logout,
    newProduct,
    deleteProduct,
    uploadProduct
}