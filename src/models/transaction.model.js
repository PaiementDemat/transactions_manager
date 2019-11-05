const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Entity = new Schema({
    email: {
        type: String,
        required: true
    }
},
{
    _id: false
})

const Transaction = new Schema({

    _id: Schema.Types.ObjectId,

    api_version: {
        type: String,
        default: 'TO DO'
    },

    commercant: Entity

});

module.exports = mongoose.model('transactions', Transaction)