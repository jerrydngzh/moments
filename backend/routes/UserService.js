var express = require('express');
var router = express.Router();
const getAccount = require('./Users/getAccounts');
const createAccount = require('./Users/createAccount');

router.get('/getAccounts', getAccount);
router.post('/createAccount', createAccount);


module.exports = router;
