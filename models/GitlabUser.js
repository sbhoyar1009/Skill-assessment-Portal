const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GitlabUserSchema = new Schema({
  gitlabID: {
    type: Number,
    unique: true,
    required: true,
  },
  // userID is nova user ID
  userID: {
    type: Number,
    unique: true,
    required: true,
  },
  firstname: { type: String },
  lastname: { type: String },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  avatar: { type: String },
  email: { type: String },
  created_at: {
    type: Date,
  },
});

module.exports = GitlabUser = mongoose.model("GitlabUser", GitlabUserSchema);
