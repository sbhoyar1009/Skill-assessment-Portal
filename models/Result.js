const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResultSchema = new Schema({
  groupID: String,
  testID: {
    type: Schema.Types.ObjectId,
    ref: "Test",
  },
  // testName: String,
  // courseCode: String,
  // courseName: String,
  // competency: String,
  // competencyCode: String,
  // subCompetency: String,
  // subCompetencyCode: String,
  // courseID: String,
  username: String,
  projectName: String,
  updatedOn: Date,
  // testEndDate: Date,
  finYear: String,
  totalScore: {
    type: Number,
    default: 0,
  }, //change it to float later on
  result: [
    {
      projectID: String,
      attemptNumber: {
        type: Number,
        default: 0,
      },
      assignmentID: String,
      assignmentTitle: String,
      assignmentResult: {
        type: Object,
        default : {}
      },
      bestScore: {
        type: Number,
        default: 0,
      }, //change it to float later on
      recentScore: {
        type: Number,
        default: 0,
      }, //change it to float later on
      lastUpdated: {
        type: String,
      },
      submitted: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = Result = mongoose.model("Result", ResultSchema);
