var express = require('express');
var router = express.Router();
const Memo = require('../models/MemoSchema');

router.get('/', async (req, res) => {
    try {
        const memos = await Memo.find();
        console.log(memos);
        res.status(200).send(memos);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Error: ' + err);
    }
});

router.get('/:id', (req, res) => {
    try {
        const memo = Memo.findById(req.params.id);
        res.status(200).send(memo);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error: ' + err);
    }
});

router.post('/', (req, res) => {
    // TODO: validation of input
    const memo = new Memo({
        name: req.body.name,
        date: req.body.date,
        location: {
            name: req.body.location.name,
            coordinates: [req.body.location.coordinates[0], req.body.location.coordinates[1]]
        },
        description: req.body.description,
        user_id: req.body.user_id,
    });
    
    try {
        memo.save();
        console.log("Created memo: " + memo)
        res.status(201).send(memo);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error: ' + err);
    }
});

router.put('/:id', (req, res) => {
    res.send('Test: PUT memo by id');
});

router.delete('/:id', (req, res) => {
    res.send('Test: DELETE memo by id');
});


module.exports = router;
