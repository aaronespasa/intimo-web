const express = require('express');
const router = express.Router();

const routesController = require('../controllers/index');

router.get('/', routesController.home);

router.get('/productos', routesController.productos);

router.get('/contacto', routesController.contacto);

//router.post('/new-product', routesController.newProduct);

module.exports = router;

