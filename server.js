const express = require('express');
const bodyParser = require('body-parser');

const { HOST, PORT } = require('./src/config/config')

const mongoClient = require('./src/config/mongodb.js')
//const routes = require('./src/routes')

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//app.use('/transaction', routes)

const model = require('./src/models/transaction.model');
const mongoose = require('mongoose')
app.get('/', async (req, res) => {
    const m = new model();
    m._id = new mongoose.Types.ObjectId;
    m.commercant = {email: 'test'}

    await m.save()
})

app.listen(PORT, HOST, err => {
    if (err) throw err;

    console.log('Listening on http://' + HOST + ':' + PORT)
})

process.on('exit', () => {
    mongoClient.connection.close()
})