const express = require('express');
const router = express.Router();

const routesController = require('../controllers/index');

router.get('/', routesController.home);

router.get('/productos/mujer', routesController.productosMujer);

router.get('/productos/hombre', routesController.productosHombre);

router.get('/productos/ninos', routesController.productosNinos);

router.get('/productos/casa', routesController.productosCasa);

router.get('/contacto', routesController.contacto);

//router.post('/new-product', routesController.newProduct);

module.exports = router;

