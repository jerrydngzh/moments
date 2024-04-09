const express = require("express");
const router = express.Router();
const Profile = require("../models/ProfileSchema");

// NOTE: for dev
// Get all profiles
router.get("/", async (req, res, next) => {
  try {
    const profiles = await Profile.find();

    res.status(200).json(profiles);
  } catch (e) {
    next(e);
  }
});

// Get profile by id
router.get("/:uid", async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ uid: req.params.uid });

    if (!profile) {
      const err = new Error("No profile with matching id found");
      err.status = 404;
      throw err;
    }

    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
});

// Create or update a profile for use with uid
router.put("/:uid", async (req, res, next) => {
  try {
    const filter = { uid: req.params.uid };
    const update = {
      bio: req.body.bio !== undefined ? req.body.bio : "",
      status_message:
        req.body.status_message !== undefined ? req.body.status_message : "",
    };
    const options = { new: true, upsert: true };

    const updatedProfile = await Profile.findOneAndUpdate(
      filter,
      update,
      options
    );

    res.status(200).json(updatedProfile);
  } catch (err) {
    next(err);
  }
});

// Delete profile by id
router.delete("/:uid", async (req, res, next) => {
  try {
    const result = await Profile.findOneAndDelete({ uid: req.params.uid });

    if (!result) {
      const err = new Error("No profile with matching id found");
      err.status = 404;
      throw err;
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
