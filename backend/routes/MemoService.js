var express = require('express');
var router = express.Router();
const createMemo = require('./Memos/createMemo');
const createSaveLoc = require('./Memos/createSaveLoc');
const getMemos = require('./Memos/getMemos');
const getSaveLoc = require('./Memos/getSaveLoc');
const updateCategories = require('./Memos/updateCategories');

router.get('/getMemos', getMemos);
router.get('/getSaveLoc', getSaveLoc);
router.post('/createMemo', createMemo);
router.post('/createSaveLoc', createSaveLoc);
router.put('/updateCategories', updateCategories);




module.exports = router;
