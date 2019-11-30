const router = require('express').Router();

const main = require('../controllers/main');
const admin = require('../controllers/admin');

// PUBLIC VIEWS
router.get('/', main.home);

router.get('/wishlist', main.wishlist);

router.get('/products?:query', main.products);

router.get('/products/view/:id', main.viewProduct);

router.get('/login', main.signin);

router.get('/signup', main.register);

router.post('/add-to-wishlist',);

router.post('/quit-wishlist',)

router.post('/signin', main.login);

router.post('/signup', main.signup);

router.get('/logout', main.logout);

// ADMIN VIEWS
router.get('/admin', admin.admin);

router.get('/admin/signin', admin.signin);

router.post('/admin/signin', admin.login);

router.post('/admin/logout', admin.logout);

// PRODUCTS MANAGEMENT VIEWS
router.get('/admin/new', admin.newProduct);

router.get('/admin/update/:id', admin.editProduct);

router.get('/admin/delete/:id', admin.deleteProduct);

router.post('/new-product', admin.uploadProduct);

router.post('/update/:id', admin.updateProduct);

module.exports = router;
