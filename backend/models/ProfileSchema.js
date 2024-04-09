const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "",
  },
  status_message: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Profile", profileSchema);
