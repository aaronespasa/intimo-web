const items = [
    {
        id: 1,
        name: 'product1'
    },
    {
        id: 2,
        name: 'product2'
    },
    {
        id: 3,
        name: 'product3'
    }
];

const home = (req, res) => {
    res.render('index.ejs', {
        title: "Íntimo"
    }); //We've had said where is index.ejs in the settings
}

const productosMujer = (req, res, next) => {
    res.render('productos-mujer', {
        title: 'Íntimo: Productos',
        items: items
    })
}

const productosHombre = (req, res, next) => {
    res.render('productos-hombre', {
        title: 'Íntimo: Productos',
        items: items
    })
}


const productosNinos = (req, res, next) => {
    res.render('productos-ninos', {
        title: 'Íntimo: Productos',
        items: items
    })
}

const productosCasa = (req, res, next) => {
    res.render('productos-casa', {
        title: 'Íntimo: Productos',
        items: items
    })
}

const contacto = (req, res, next) => {
    res.render('../views/contacto.ejs', {
        title: "Íntimo: Contacto"
    })
}

/*const newProduct = (req, res, next) => {
    const { newItem } = req.body; //It's the same as: const newItem = req.body.newItem;
    items.push({
        id: items.length + 1,
        name: newItem
    });
    res.redirect('/productos');
}*/

module.exports = {
    home, //Is the same as -> home: home
    productosMujer,
    productosHombre,
    productosNinos,
    productosCasa,
    contacto
}