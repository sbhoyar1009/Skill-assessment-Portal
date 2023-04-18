const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SkillTestUserSchema = new Schema({
  gitlabID: {
    type: Number,
    unique: true,
    required: true,
  },
  // userID is nova user ID
  empID: {
    type: Number,
    unique: true,
    required: true,
  },
  name: { type: String },
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

module.exports = SkillTestUser = mongoose.model(
  "SkillTestUser",
  SkillTestUserSchema
);
