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
            transaction_id: new_transaction._id,
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

const addCustomers = transaction => {

    const transaction_id = transaction.transaction_id;
    const customers = transaction.transaction_details.customers;
    
    return new Promise(async function (resolve, reject) {
        await Transaction.findOne({
            _id: transaction_id
        }, (err, transaction_found) => {
            if (err) console.error(err);

            if (!transaction_found) reject({status: 'TO DO'});

            else {
                customers.forEach(customer => {
                    transaction_found.transaction_details.customers.push(customer);
                });

                await transaction_found.save();

                resolve(transaction_found);
            }
        })
    });

};

module.exports = {
    create,
    addCustomers
}