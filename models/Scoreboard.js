//this schema will store scoreboards for all the tests
// in cases if there are multiple test going on simultaneously, scoreboard of a
// particular test can be fetched or updated

const mongoose = require("mongoose");

const ScoreboardSchema = new mongoose.Schema([
  {
    assignmentId: Schema.Types.ObjectId,
    scoreboard: [
      {
        username: {
          type: String,
          required: true,
          unique: true,
        },
        score: Number,
      },
    ],
  },
]);

module.exports = Scoreboard = mongoose.model("Scoreboard", ScoreboardSchema);
