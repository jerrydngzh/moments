var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.send('Test: GET all memos');
});

router.get('/:id', (req, res) => {
    res.send('Test: GET memo by id');
});

router.post('/', (req, res) => {
    res.send('Test: POST new memo');
});

router.put('/:id', (req, res) => {
    res.send('Test: PUT memo by id');
});

router.delete('/:id', (req, res) => {
    res.send('Test: DELETE memo by id');
});


module.exports = router;
