const mongoose = require('mongoose')

const Transaction = require('../models/transaction.model');
const Token = require('./token.controller')

const create = transaction => {

    return new Promise(async function (resolve, reject){
        const new_transaction = new Transaction({
            _id: new mongoose.Types.ObjectId,

            transaction_details: {
                nb_entities: 1,
                amount: transaction.transaction_details.amount,
                commercant: {
                    email: transaction.transaction_details.commercant.email,
                    amount: transaction.transaction_details.amount
                },
                customers: []
            },

            done: false
        })

        new_transaction.transaction_key = Token.createToken({
            commercant: new_transaction.transaction_details.commercant.email,
            amount: new_transaction.transaction_details.amount
        }, '20min');

        await new_transaction.save((err, transaction_created) => {
            if (err) {
                console.error(err);
                reject({});
            }

            if (transaction_created) resolve(transaction_created);
        })
    });

};

module.exports = {
    create
}