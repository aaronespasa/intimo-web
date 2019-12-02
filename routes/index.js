const router = require('express').Router();

const main = require('../controllers/main');
const admin = require('../controllers/admin');

// PUBLIC VIEWS
router.get('/', main.home);

router.get('/wishlist', main.wishlist);

router.get('/products?:query', main.products);

router.get('/products/view/:id', main.viewProduct);

router.get('/login?:query', main.signin);

router.get('/signup?:query', main.register);

router.post('/add-to-wishlist',);

router.post('/quit-wishlist',)

router.post('/signin?:query', main.login);

router.post('/signup?:query', main.signup);

router.get('/logout?:query', main.logout);

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

router.get('/delete/:id', admin.deleteProduct);

router.get('/add-to-featured/:id', admin.addPrdToFeatured);

router.get('/remove-from-featured/:id',admin.removePrdFromFeatured);

module.exports = router;
