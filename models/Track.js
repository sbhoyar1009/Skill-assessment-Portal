const mongoose = require("mongoose");

// const track = new mongoose.Schema({});
const TrackSchema = new mongoose.Schema({
  projectID: {
    type: Number,
    required: true,
  },
  trackName: {
    type: String,
    required: true,
  },
  adminURL: {
    type: String,
  },
  testID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
  },
});

module.exports = Track = mongoose.model("Track", TrackSchema);
