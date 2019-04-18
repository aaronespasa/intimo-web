const Product = require('../models/Products');
const SESS_NAME = require('../index').SESS_NAME;
const users = [
    { id: 1, email: 'adri@adri.com', password: '1234' },
    { id: 2, email: 'aaron@aaron.com', password: '2345' },
    { id: 3, email: 'monica@monica.com', password: '3456' }
]

const ctrl = {}

//*****************************
//ADMIN
//*****************************

ctrl.admin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/admin/signin');
    } else {
        res.render('admin', {
            title: 'Admin'
        });
    }
    
}

ctrl.signin = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/admin');
    } else {
        res.render('signin', {
            title: 'Login'
        })
    }    
}
    

ctrl.login = (req, res, next) => {
    const { email, password } = req.body;
    if (email && password) {
        const user = users.find(
            user => user.email === email && user.password === password
        );

        if (user) {
            req.session.userId = user.id;
            res.redirect('/admin');
        } else {
            res.redirect('/admin/signin');
        }
    }
}

ctrl.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/admin');
        }
        res.clearCookie(SESS_NAME);
        res.redirect('/');
    });
}

ctrl.newProduct = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/admin/signin');
    } else {
        res.render('newProduct', {
            title: "Íntimo: Crear Producto"
        });
    }
}

ctrl.deleteProduct = (req, res, next) => {

}
    
ctrl.uploadProduct = async (req, res) => {
    const product = new Product();

    product.name = req.body.name;
    product.description = req.body.description;
    product.sex = req.body.sex;
    product.age = req.body.age;
    product.type = req.body.type;
    product.filename = req.file.filename;
    product.path = '/images/products/' + req.file.filename;
    product.originalname = req.file.originalname;

    await product.save();

    res.redirect('/admin');
}

module.exports = ctrl;