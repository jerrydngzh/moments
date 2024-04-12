var express = require("express");
var router = express.Router();
const Memo = require("../models/MemoSchema");
const { uploadFiles } = require("../services/media.service");
const Multer = require("multer");
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
})

// NOTE: admin only
router.get("/", async (req, res, next) => {
  try {
    const memos = await Memo.find();
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
      const err = new Error(`Memo with _id ${mid} not found`);
      err.status = 404;
      throw err;
    }

    res.status(200).send(memo);
  } catch (err) {
    next(err);
  }
});

router.post("/:uid", multer.any(), async (req, res, next) => {
  let memoData = JSON.parse(req.body.memo);
  let fileData = req.files;
  const uid = req.params.uid;
  let fileNames = [];

  // Upload files to cloud storage
  try {
    fileNames = await uploadFiles(fileData);
  } catch (error) {
    next(error)
    return;
  }

  console.log(fileNames);

  try {
    const memo = new Memo({
      uid: uid,
      name: memoData.name,
      date: memoData.date,
      location: {
        name: memoData.location.name,
        coordinates: [
          memoData.location.coordinates[0],
          memoData.location.coordinates[1],
        ],
      },
      description: memoData.description,
      media: fileNames
    });

    const result = await memo.save();
    res.status(201).send(result);
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
    media: req.body.media
  };

  try {
    const memo = await Memo.findOneAndUpdate(
      { _id: mid, uid: uid },
      memoToUpdate,
      { new: true }
    );

    if (!memo) {
      const err = new Error(`Memo with _id ${mid} not found`);
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
      const err = new Error(`Memo with _id ${mid} not found`);
      err.status = 404;
      throw err;
    }

    res.status(200).json({ message: "Deleted memo" });
  } catch (err) {
    next(err);
  }

  // TODO: delete media files from cloud storage
});

module.exports = router;
