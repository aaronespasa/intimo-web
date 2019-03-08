const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/intimo-app', {
    useCreateIndex: true,
    useNewUrlPasser:true,
    useFindAndModify: false
})
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));

