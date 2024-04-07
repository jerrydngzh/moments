const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: ''
  },
  status_message: {
    type: String,
    default: ''
  },
  profile_picture: {
    type: String, // Assuming profile picture will be stored as a URL
    default: '' // You can set a default URL for a default profile picture if needed
  }
});

module.exports = mongoose.model("Profile", profileSchema);
