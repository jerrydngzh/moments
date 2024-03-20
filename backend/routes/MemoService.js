var express = require('express');
var router = express.Router();
const Memo = require('../models/MemoSchema');

// NOTE: dev only
router.get('/', async (req, res) => {
    try {
        const memos = await Memo.find({});
        console.log(memos);
        res.status(200).send(memos);
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Error: ' + err);
    }
});


// TODO: update to use JWT for auth for user instead of passing a user_id
router.get('/user/:id', async (req, res) => {
    // TODO: validate user_id is a valid user


    try {
        const memos = await Memo.find({ user_id: req.params.id });
        console.log(memos);
        res.status(200).send(memos);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error: ' + err);
    }
});

// TODO: add in authentication for create
router.get('/:id', (req, res) => {
    try {
        const memo = Memo.findById(req.params.id);
        res.status(200).send(memo);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error: ' + err);
    }
});

// TODO: validation of input
// TODO: add in authentication for create
router.post('/', async (req, res) => {
    const memo = {
        name: req.body.name,
        date: req.body.date,
        location: {
            name: req.body.location.name,
            coordinates: [req.body.location.coordinates[0], req.body.location.coordinates[1]]
        },
        description: req.body.description,
        user_id: req.body.user_id,
    };
    
    try {
        const result = await Memo.create(memo);

        if (!result) {
            console.log(result)
            res.status(400).send('Document not created');
        }

        console.log("Created memo: " + result)
        res.status(201).send(memo);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error: ' + err);
    }
});

// TODO: add in validation for update 
// TODO: add in authentication for update
router.put('/:id', async (req, res) => {
    // search for memo by id
    // update memo with new data
    const memoToUpdate = {
        name: req.body.name,
        date: req.body.date,
        location: {
            name: req.body.location.name,
            coordinates: [req.body.location.coordinates[0], req.body.location.coordinates[1]]
        },
        description: req.body.description,
        user_id: req.body.user_id,
    };

    try {
        const memo = await Memo.findOneAndUpdate(
            { _id: req.body.id },
            new Memo(memoToUpdate),
            { new: true })
        
        if (!memo) {
            res.status(404).send('Memo not found');
        }

        console.log("Updated memo: " + memo);
        res.status(200).send('Updated ' + req.params.id + ' with new data:' + memo);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error: ' + err);
    }
});

router.delete('/:id', (req, res) => {
    res.send('Test: DELETE memo by id');
});


module.exports = router;
