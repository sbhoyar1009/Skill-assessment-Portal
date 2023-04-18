const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NovaUserSchema = new Schema({
  gitlabID: {
    type: Number,
    unique: true,
    required: true,
  },
  name: { type: String, required: true },
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

module.exports = NAB1_user = mongoose.model("NAB1_user", NovaUserSchema);
