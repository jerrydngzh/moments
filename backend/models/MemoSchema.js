const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const memoSchema = new mongoose.Schema({
  // _id uniquely idenfities a memo object
  // uid is the identifier for the user who created it
  uid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  location: {
    type: locationSchema,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  media: {
    type: [String]
  }
});
const Memo = mongoose.model("Memo", memoSchema);
module.exports = Memo;
