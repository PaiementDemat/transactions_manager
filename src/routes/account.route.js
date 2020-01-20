const express = require('express');

const router = express.Router();

const Account = require('../controllers/account.controller');
const Transaction = require('../controllers/transaction.controller')

router.post('/', async function (req, res) {
    try {
        
        Account.create(req).then(

            () => res.send({
                status: 'success'
            }),
    
            errors => res.send({
                status: 'error',
                errors
            })

        )

    } catch (error) {
        throw error
    }
});

router.get('/:account_id', async function (req, res) {
    try {
        
        Account.accountInfo(req).then(

            info => res.send({
                status: 'success',
                info
            }),
    
            errors => res.send({
                status: 'error',
                errors
            })

        )

    } catch (error) {
        throw error
    }
});

router.get('/', async function(req, res) {
    try {
        Account.getAccounts(req).then(

            accounts => res.send({
                status: 'success',
                accounts
            }),

            errors => res.send({
                status: 'error',
                errors
            })

        )
    } catch (error) {
        throw error
    }
});

router.get('/transaction/:transaction_id', async function(req, res) {
    try {
        Transaction.transactionInfo(req).then(

            transaction => res.send({
                status: 'success',
                transaction
            }),

            errors => res.send({
                status: 'error',
                errors
            })

        )
    } catch (error) {
        throw error
    }
});

router.post('/add/:account_id', async function(req, res) {
    try {
        Account.addMoney(req).then(

            add => res.send({
                status: 'success',
                add
            }),

            errors => res.send({
                status: 'error',
                errors
            })

        )
    } catch (error) {
        throw error
    }
})

module.exports = router;