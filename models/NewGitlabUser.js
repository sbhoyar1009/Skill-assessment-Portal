const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewGitlabUserSchema = new Schema({
  gitlabID: {
    type: Number,
    unique: true,
    required: true,
  },
  // userID is nova user ID
  userID: {
    type: Number,
    // unique: true,
    // required: true,
  },
  firstname: { type: String },
  lastname: { type: String },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  avatar: { type: String },
  name: { type: String },
  email: { type: String },
  prefix: { type: String },
  created_at: {
    type: Date,
    default : Date.now(),
  },
});

module.exports = NewGitlabUser = mongoose.model(
  "NewGitlabUser",
  NewGitlabUserSchema
);
