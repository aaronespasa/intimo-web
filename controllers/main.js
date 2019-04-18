const Product = require('../models/Products');

const ctrl = {}

//*****************************
//HOME && PRODUCTS
//*****************************

ctrl.home = (req, res) => {
    res.render('index', {
        title: "Íntimo"
    }); //We've had said where is index.ejs in the settings
}

ctrl.products = async (req, res) => {
    const items = await Product.find();
    res.render('productos', {
        title: 'Íntimo: Productos',
        items: items
    })
}

module.exports = ctrl;