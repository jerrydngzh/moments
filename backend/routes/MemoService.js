var express = require("express");
var router = express.Router();
const Memo = require("../models/MemoSchema");
const User = require("../models/UserSchema");

// NOTE: admin only
router.get("/all", async (req, res, next) => {
  try {
    const memos = await Memo.find({});
    res.status(200).send(memos);
  } catch (err) {
    next(err);
  }
});

// Get all user's memo
router.get("/:uid", async (req, res, next) => {
  const uid = req.params.uid;

  try {
    const memos = await Memo.find({ uid: uid });

    if (memos.length === 0) {
      const err = new Error("No memos found");
      err.status = 404;
      throw err;
    }

    res.status(200).send(memos);
  } catch (err) {
    next(err);
  }
});

// Get single memo from user
router.get("/:uid/:mid", async (req, res, next) => {
  const mid = req.params.mid;
  const uid = req.params.uid;

  try {
    const memo = await Memo.findById({ _id: mid, uid: uid });

    if (!memo) {
      const err = new Error("No memos found");
      err.status = 404;
      throw err;
    }

    res.status(200).send(memo);
  } catch (err) {
    next(err);
  }
});

router.post("/:uid", async (req, res, next) => {
  const uid = req.params.uid;

  try {
    const memo = new Memo({
      uid: uid,
      name: req.body.name,
      date: req.body.date,
      location: {
        name: req.body.location.name,
        coordinates: [
          req.body.location.coordinates[0],
          req.body.location.coordinates[1],
        ],
      },
      description: req.body.description,
    });

    const result = await memo.save();

    res.status(201).send(memo);
  } catch (err) {
    next(err);
  }
});

router.put("/:uid/:mid", async (req, res, next) => {
  const mid = req.params.mid;
  const uid = req.params.uid;

  // TODO: check for fields to update instead of updating all fields
  const memoToUpdate = {
    name: req.body.name,
    date: req.body.date,
    location: {
      name: req.body.location.name,
      coordinates: [
        req.body.location.coordinates[0],
        req.body.location.coordinates[1],
      ],
    },
    description: req.body.description,
  };

  try {
    const memo = await Memo.findOneAndUpdate(
      { _id: mid, uid: uid },
      memoToUpdate,
      { new: true }
    );

    if (!memo) {
      const err = new Error("Memo not found");
      err.status = 404;
      throw err;
    }
    res.status(200).send(memo);
  } catch (err) {
    next(err);
  }
});

router.delete("/:uid/:mid", async (req, res, next) => {
  const mid = req.params.mid;
  const uid = req.params.uid;

  try {
    const memo = await Memo.findOneAndDelete({
      _id: mid,
      uid: uid,
    });

    if (!memo) {
      const err = new Error("Memo not found");
      err.status = 404;
      throw err;
    }

    res.status(200).json({ message: "Deleted memo" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
