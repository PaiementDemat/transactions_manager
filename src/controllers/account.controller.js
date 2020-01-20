const Token = require('./token.controller');
const ObjectId = require('mongodb').ObjectId

const checkAccess = req => {
    const api_key = Token.getToken(req);
    if(api_key == null) return null
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

    return new Promise(async function (resolve, reject) {

        const account = req.body.account;
        const headers = req.headers;

        const db = req.app.locals.db.payment;

        const token = checkAccess(req);

        if ( token === null ) return reject('Token invalid');

        const new_account = {
            user_email: token.email,
            account_details: {
                type: account.type
            },
            balance: 0.0,
            transactions_history: [],
            created_at: new Date(Date.now()).toISOString(),
            last_transaction: '',
            enable: true,
            accounts: []
        }



        await db.collection('accounts').insertOne(new_account, async (err, account_created) => {
            if (err) reject(err);
            if (account_created) {
                const id = account_created.ops[0]._id;

                await db.collection('users').updateOne({
                    email: token.email
                }, {
                    '$push': {
                        accounts: id
                    }
                }, (err, updated) => {
                    if (err) reject(err);
                    if (updated) resolve()
                })
            };
        })

    })
}

const accountInfo = req => {
    
    return new Promise(async function (resolve, reject) {

        const id = req.params.account_id;
        const headers = req.headers;

        const db = req.app.locals.db.payment;

        const user_token = checkAccess(req)
        if ( user_token == null ) return reject('Token invalid');

        await db.collection('accounts').findOne({
            '_id': ObjectId(id)
        }, (err, account_found) => {
            if (err) reject(err);
            if (account_found) resolve(account_found);
        })
    })
};

const getAccounts = req => {
    return new Promise(async function(resolve, reject) {

        const user_token = checkAccess(req)
        if ( user_token == null ) return reject('Token invalid');

        const headers = req.headers;
        const db = req.app.locals.db.payment;

        await db.collection('users').findOne({
            email: user_token.email
        }, async (err, user_found) => {
            if (err) reject(err);
            if (user_found) {
                await db.collection('accounts').find({
                    _id: { '$in': user_found.accounts }
                }).toArray((err, list) => {
                    if (err) reject(err);
                    if (list) resolve(list)
                })
            }
        })
    })
}

const addMoney = req => {
    return new Promise(async function(resolve, reject) {

        const user_token = checkAccess(req)
        if ( user_token == null ) return reject('Token invalid');

        const amount = req.body.account.add;
        const account_id = req.params.account_id
        const headers = req.headers;
        const db = req.app.locals.db.payment;

        await db.collection('accounts').updateOne({
            '_id': ObjectId(account_id)
        },{
            '$inc': {
                balance: + amount
            }
        }, (err, updated) => {
            if (err) reject(err);
            if (updated) resolve(updated);
        })

    })
}

module.exports = {
    create,
    accountInfo,
    getAccounts,
    addMoney
}