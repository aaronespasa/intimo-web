const router = require('express').Router()

const main = require('../controllers/main')
const admin = require('../controllers/admin')

// PUBLIC VIEWS
router.get('/', main.home)

router.get('/products/:filter', main.products)

router.get('/products?:search', main.productSearch)

router.get('/products/view/:id', main.viewProduct)

router.post('/signin', main.signin);

router.post('/login', main.login);

router.post('/logout', main.logout);

//ADMIN VIEWS
router.get('/admin' , admin.admin);

router.get('/admin/signin', admin.signin)

router.post('/admin/signin', admin.login)

router.post('/admin/logout', admin.logout)

// PRODUCTS MANAGEMENT VIEWS
router.get('/admin/new', admin.newProduct)

router.get('/admin/update/:id', admin.editProduct)

router.get('/admin/delete/:id', admin.deleteProduct)

router.post('/new-product', admin.uploadProduct)

router.post('/update/:id', admin.updateProduct)

module.exports = router
