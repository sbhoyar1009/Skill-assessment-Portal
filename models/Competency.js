const mongoose = require("mongoose");

const CompetencySchema = new mongoose.Schema({
  CompetencyID: {
    type: Number,
    required: true,
  },
  Competency: {
    type: String,
    required: true,
  },
  subcompetencies : [{
    SubCompetencyID: {
      type: Number,
      required: true,
    },
    SubCompetency: {
        type: String,
        required: true,
      }
  }]
});

module.exports = Competency = mongoose.model("Competency", CompetencySchema);
