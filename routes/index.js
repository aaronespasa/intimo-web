const router = require('express').Router();

const main = require('../controllers/main');
const admin = require('../controllers/admin');

// PUBLIC VIEWS
router.get('/', main.home); //Main page

router.get('/wishlist', main.wishlist); //Wishlist

router.get('/products?:query', main.products); //Products list

router.get('/products/view/:id', main.viewProduct); //Product view

router.get('/login?:query', main.signin); //User login view

router.get('/signup?:query', main.register); //User register view

router.post('/wishlist/add/:id', main.addToWishList); //Adds product to wishlist

router.post('/wishlist/quit/:id', main.removeFromWishList) //Removes product from wishlist

router.post('/signin?:query', main.login); //User login logic

router.post('/signup?:query', main.signup); //User register logic

router.get('/logout?:query', main.logout); //User logout logic

// ADMIN VIEWS
router.get('/admin', admin.admin); //Main admin view

router.get('/admin/signin', admin.signin); //Admin login view

router.post('/admin/signin', admin.login); //Admin login logic

router.post('/admin/logout', admin.logout); //Admin logout logic

// PRODUCTS MANAGEMENT VIEWS
router.get('/admin/new', admin.newProduct); //Create new product view

router.get('/admin/update/:id', admin.editProduct); //Update product view

router.post('/new-product', admin.uploadProduct); //Create product logic

router.post('/update/:id', admin.updateProduct); //Update product logic

router.get('/delete/:id', admin.deleteProduct); //Delete product logic

router.get('/add-to-featured/:id', admin.addPrdToFeatured); //Adds product to featured products list

router.get('/remove-from-featured/:id',admin.removePrdFromFeatured); //Removes product from featured products list

module.exports = router;
