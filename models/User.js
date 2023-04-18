const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
  name: { type: String },
  email: { type: String },
  avatar: {
    type: String,
    default:
      "https://secure.gravatar.com/avatar/0d53fcd01876c0df967410ab3bfcf346?s=80&d=identicon",
  },
  gitlabID: { type: String },
  Tests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }],
});

module.exports = User = mongoose.model("User", UserSchema);
