const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  gitlabUserProjectId: {
    type: Number,
  },
  gitlabGroupId: { type: Number },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  problemStatement: String,
  description: {
    type: String,
    //required: true,
  },
  inputFormat: {
    type: String,
    //required: true,
  },
  outputFormat: {
    type: String,
    //required: true,
  },
  constraints: String,
  maxScore: {
    type: Number,
    required: true,
  },

  file: {
    type: Boolean,
    default: false,
  },
  Competency: {
    type: String,
    required: true,
  },
  subCompetencies: [{
    type: String,
    required: true,
  },],
  level : {
    type: String,
    required : true
  }
});

module.exports = Assignment = mongoose.model("Assignment", AssignmentSchema);
