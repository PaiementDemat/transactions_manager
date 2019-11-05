const mongoose = require('mongoose');

const { USERSDB_URL } = require('./config')

mongoose.connect(USERSDB_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err, client) => {
    if (err) throw err;

    return client;
})