var express = require("express");
var router = express.Router();
const User = require("../models/UserSchema");

// NOTE: for dev
// Get all users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (e) {
    next(e);
  }
});

// Get user by id
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      const err = new Error("No user with matching id found");
      err.status = 404;
      throw err;
    }

    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

// Create new user
router.post("/", async (req, res, next) => {
  try {
    const user = new User({
      uid: req.body.uid,
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
    });

    const savedUser = await user.save();
    res.status(200).json(savedUser);
  } catch (e) {
    next(e);
  }
});

// Edit user properties
router.put("/:id", async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      const err = new Error("No user with matching id found");
      err.status = 404;
      throw err;
    }

    // only update the existing properties found in body
    user.email = req.body.email !== undefined ? req.body.email : user.email;
    user.username =
      req.body.username !== undefined ? req.body.username : user.username;
    user.first_name =
      req.body.first_name !== undefined ? req.body.first_name : user.first_name;
    user.last_name =
      req.body.last_name !== undefined ? req.body.last_name : user.last_name;
    user.memos =
      req.body.memos !== undefined ? req.body.memos : user.memos;
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (e) {
    next(e);
  }
});

// Delete user by id
router.delete("/:id", async (req, res, next) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);

    if (!result) {
      const err = new Error("No user with matching id found");
      err.status = 404;
      throw err;
    }

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
