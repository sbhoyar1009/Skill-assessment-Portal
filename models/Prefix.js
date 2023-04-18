const mongoose = require("mongoose");

// const track = new mongoose.Schema({});
const PrefixSchema = new mongoose.Schema({
  prefix: {
    type: String,
    required: true,
  },
});

module.exports = Track = mongoose.model("Prefix", PrefixSchema);
