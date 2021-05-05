'use strict';

/**
* Config file for a https://github.com/micromata/http-fake-backend to
* mock the PythonBankBeispiel backend.
*
* Just place in ./server/api folder.
*/

const SetupEndpoint = require('./setup/');

const prefix = "/bank"

module.exports = SetupEndpoint({
    name: 'bank',
    urls: [{
        params: '/customers',
        requests: [{
            method: 'GET',
            response: '/response-files/bank/customers.json'
        },
        {
            method: ['POST'],
            response: '/response-files/bank/customer.json'
        }]
    }, {
        params: '/customers/{id}',
        requests: [{
            method: ['GET'],
            response: '/response-files/bank/customer.json'
        }, {
            method: ['PUT'],
            response: '/response-files/bank/customer.json'
        }, {
            method: 'DELETE',
            response: '/response-files/bank/customer.json'
        }]
    }, {
        params: '/customers/{id}/accounts',
        requests: [{
            method: 'GET',
            response: '/response-files/bank/accountsfor1.json'
        }, {
            method: ['POST'],
            response: '/response-files/bank/account.json'
        }]
    }, {
        params: '/accounts',
        requests: [{
            method: 'GET',
            response: '/response-files/bank/allaccounts.json'
        }]
    }, {
        params: '/accounts/{id}',
        requests: [{
            method: 'GET',
            response: '/response-files/bank/account.json'
        },
        {
            method: ['delete'],
            response: {
                deleted: true
            }
        }]
    }, {
        params: '/accounts/{id}/balance',
        requests: [{
            method: 'GET',
            response: '/response-files/bank/balance.json'
        }]
    }, {
        params: '/account/{id}/credits',
        requests: [{
            method: 'GET',
            response: '/response-files/bank/creditsfor1.json'
        }]
    }, {
        params: '/account/{id}/debits',
        requests: [{
            method: 'GET',
            response: '/response-files/bank/debitsfor1.json'
        }]
    }
    ]
});

