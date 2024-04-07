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

// Create new profile
router.post("/", async (req, res, next) => {
  try {
    const profile = new Profile({
      uid: req.body.uid,
      bio: req.body.bio,
      status_message: req.body.status_message,
      profile_picture: req.body.profile_picture,
    });

    const savedProfile = await profile.save();
    res.status(200).json(savedProfile);
  } catch (err) {
    next(err);
  }
});

// Update profile by id
router.put("/:uid", async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ uid: req.params.uid });

    if (!profile) {
      const err = new Error("No profile with matching id found");
      err.status = 404;
      throw err;
    }

    profile.bio = req.body.bio !== undefined ? req.body.bio : profile.bio;
    profile.status_message =
      req.body.status_message !== undefined
        ? req.body.status_message
        : profile.status_message;
    profile.profile_picture =
      req.body.profile_picture !== undefined
        ? req.body.profile_picture
        : profile.profile_picture;

    const updatedProfile = await profile.save();
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