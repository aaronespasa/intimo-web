const { Router } = require('express');
const router = Router();

const routesController = require('../controllers/index');

router.get('/', routesController.home);

router.get('/productos/mujer', routesController.productosMujer);

router.get('/productos/hombre', routesController.productosHombre);

router.get('/productos/ninos', routesController.productosNinos);

router.get('/productos/casa', routesController.productosCasa);

router.get('/admin' , routesController.admin);

router.get('/admin/new', routesController.newProduct);

router.get('/admin/signin', routesController.signin);

router.post('/admin/signin', routesController.login);

router.post('/admin/logout', routesController.logout);

router.post('/new-product', routesController.uploadProduct)

module.exports = router;

