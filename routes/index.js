const { Router } = require('express');
const router = Router();

const main = require('../controllers/main');
const admin = require('../controllers/admin');

router.get('/', main.home);

router.get('/productos', main.products);

router.get('/admin' , admin.admin);

router.get('/admin/new', admin.newProduct);

router.get('/admin/delete', admin.admin);

router.get('/admin/signin', admin.signin);

router.post('/admin/signin', admin.login);

router.post('/admin/logout', admin.logout);

router.post('/new-product', admin.uploadProduct)

module.exports = router;

