const Product = require('../models/Products');

const ctrl = {}

//*****************************
//HOME && PRODUCTS
//*****************************

ctrl.home = (req, res) => {
    res.render('main/home', {
        title: "Íntimo",
        admin: false
    }); //We've had said where is index.hbs in the settings
}

ctrl.products = async (req, res) => {
    var items;
    if (req.params.filter === 'all') {
        items = await Product.find().sort({ created_at: -1 });
    }
    else {
        items = await Product.find({ sex: req.params.filter || 'unisex' }).sort({ created_at: -1 });
    }
    res.render('main/productos', {
        title: 'Íntimo: Productos',
        items: items,
        admin: false
    })
}

ctrl.viewProduct = async (req, res) => {
    const item = await Product.findById(req.params.id);
    res.render('main/viewProduct', {
        title: 'Íntimo: Producto',
        item: item,
        admin: false
    })
}

module.exports = ctrl;