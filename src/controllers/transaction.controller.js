const Token = require('./token.controller');
const ObjectId = require('mongodb').ObjectId

const checkAccess = req => {
    const api_key = Token.getToken(req);
    var validate = false

    // expiration & integrity validation
    Token.validateToken(api_key, (err, validated) => {
        if (validated) validate = true
    });

    // read
    if (validate) {
        const token = Token.readToken(api_key);
        return token;
    }
    else return null
}

const create = req => {

    return new Promise(async function (resolve, reject){

        const transaction = req.body.transaction;
        const headers = req.headers;

        const db = req.app.locals.db.payment

        const token = checkAccess(req);
        if ( token == null ) return reject('Token invalid')

        const new_transaction = {
            transaction_details: {
                nb_entities: 1,
                amount: transaction.amount,
                commercant: {
                    email: token.email,
                    username: token.username
                },
                customers: [],
                comments: transaction.comments
            },
            source: {
                host: headers['host'],
                browser: headers['user-agent'],
                time: new Date(Date.now()).toISOString()
            },
            created_at: new Date(Date.now()).toISOString(),
            done: false
        }

        await db.collection('transactions').insertOne(new_transaction, (err, trans_created) => {
            if (err) reject(err);
            if (trans_created) {
                const id = trans_created.ops[0]._id;
                const token = Token.createToken({
                    transaction_id: id,
                    commercant: new_transaction.transaction_details.commercant.email,
                    amount: new_transaction.transaction_details.amount
                }, '20min');

                db.collection('transactions').updateOne({ 
                    _id: id
                 },{
                    '$set': {
                        transaction_key: [ token ]
                    }
                 })
            
                resolve(token)
            }
        })
    });

};

const pay = req => {

    return new Promise(async function (resolve, reject) {

        let transaction_key = req.body.transaction.transaction_key;
        const payer_account = req.body.transaction.payer_account;
        const headers = req.headers;

        const db = req.app.locals.db.payment;

        const token = checkAccess(req)
        if ( token == null ) return reject('Token invalid')
        const customer_email = token.email;

        Token.validateToken(transaction_key, (err, validated) => {
            if (err) return reject('Transaction token invalid')
        })

        transaction_key = Token.readToken(transaction_key);
        const transaction_id = transaction_key.transaction_id;
        const commercant_email = transaction_key.commercant;
        const amount = transaction_key.amount;

        await db.collection('transactions').findOneAndUpdate(
            {
                transaction_key
            }, {
                '$set': {
                    done: true,
                    nb_entities: 2,
                    done_at: new Date(Date.now()).toISOString(),
                    'transaction_details.customers': customer_email
                }
            }, (err, updated) => {
                if (err) reject(err);
            }
        )

        await db.collection('accounts').updateOne({
            _id: ObjectId(payer_account)
        },{
            '$inc': {
                balance: - amount
            },
            '$push': {
                transactions_history: transaction_id
            }
        }, (err, updated) => {
            if (err) reject(err);
        });

        await db.collection('accounts').updateOne({
            user_email: commercant_email
        }, {
            '$inc': {
                balance: + amount
            },
            '$push': {
                transactions_history: transaction_id
            }
        }, (err, updated) => {
            if (err) reject(err);
            if (updated) resolve(updated)
        })

    });

};

const transactionInfo = req => {
    return new Promise(async function(resolve, reject) {

        const transaction_id = req.params.transaction_id;
        const headers = req.headers;

        const db = req.app.locals.db.payment;

        const token = checkAccess(req)
        if ( token == null ) return reject('Token invalid')

        await db.collection('transactions').findOne({
            _id: ObjectId(transaction_id)
        }, (err, trans_found) => {
            if (err) reject(err);
            resolve(trans_found);
        })
    })
}

module.exports = {
    create,
    pay,
    transactionInfo
}