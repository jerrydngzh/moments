var express = require('express');
var router = express.Router();
const Memo = require('../models/MemoSchema');
const User = require('../models/UserSchema');

// NOTE: dev only
// TODO: secure with Admin role
router.get('/:pass/all', async (req, res) => {
    const pass = req.params.pass;
    if (pass !== 'password') {
        res.status(401).send('Unauthorized');
        return;
    }

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
// get for a user's memos
router.get('/:user_id', async (req, res) => {
    // const username = req.params.username;

    // TODO: validate user_id is a valid user

    try {
        // returns array of objects
        const memos = await Memo.find({ user_id: user_id });
        console.log(memos);
        res.status(200).send(memos);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error: ' + err);
    }
});

// TODO: add in authentication for create
router.get('/:user_id/:id', async (req, res) => {
    const memo_id = req.params.id;
    const userID = req.params.user_id;

    // TODO: validate for user_id & memo_id pair

    try {
        const memo = await Memo.findById({ _id: memo_id, user_id: userID });
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
            return;
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
    const memo_id = req.params.id;
    const userID = req.body.user_id;
    const memoToUpdate = {
        name: req.body.name,
        date: req.body.date,
        location: {
            name: req.body.location.name,
            coordinates: [req.body.location.coordinates[0], req.body.location.coordinates[1]]
        },
        description: req.body.description
    };

    try {
        const memo = await Memo.findOneAndUpdate(
            { _id: memo_id, user_id: userID },
            memoToUpdate,
            { new: true })

        if (!memo) {
            res.status(404).send('Memo not found');
            return;
        }

        console.log("Updated memo: " + memo);
        res.status(200).send(memo);
    } catch (err) {
        console.log(err);
        res.status(500).send('Error: ' + err);
    }
});

router.delete('/:user_id/:memo_id', async (req, res) => {
    // TODO: validate user_id & memo_id pair
    const memo_id = req.params.memo_id;
    const user_id = req.params.user_id;

    if (!memo_id) {
        res.status(400).send({ error: 'Bad request: memo_id is required' });
        return;
    }

    try {
        const memo = await Memo.findOneAndDelete({ _id: memo_id, user_id: user_id});

        if (!memo) {
            res.status(404).send('Memo not found');
            return;
        }

        console.log("Deleted memo: " + memo); 
        res.status(200).send({status:'Deleted memo: ', memo});
    } catch (err) {
        console.log(err);
        res.status(500).send('Error: ' + err);
    }
});


module.exports = router;
