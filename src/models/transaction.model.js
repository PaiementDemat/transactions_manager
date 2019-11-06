const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Entity = new Schema({
    email: {
        type: String,
        required: true
    },

    amount: {
        type: Number
    }
},
{
    _id: false
});

const Transaction = new Schema({

    _id: Schema.Types.ObjectId,

    api_version: {
        type: String,
        default: 'TO DO'
    },

    transaction_key: {
        type: String,
        required: true
    },

    transaction_details: {
        nb_entities: {
            type: Number,
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            default: 0,
        },

        commercant: Entity,

        customers: [ Entity ],
    },

    done: {
        type: Boolean,
        default: false
    }

});

Transaction.pre('validate', function (next) {
    // TO DO
    next()
});

module.exports = mongoose.model('transactions', Transaction)