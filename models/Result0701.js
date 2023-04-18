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
  finYear: Number,
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
        cxxtest: {
          tests: { type: Number, default: 0 },
          failures: { type: Number, default: 0 },
          errors: { type: Number, default: 0 },
          score: { type: Number, default: 0 },
        },
        cloc: {
          lineOfCode: { type: Number, default: 0 },
          commentCode: { type: Number, default: 0 },
          blankLines: { type: Number, default: 0 },
          numberOfFiles: { type: Number, default: 0 },
        },
        cpd: {
          summary: {
            duplicateBlocks: { type: Number, default: 0 },
            duplicateTokens: { type: Number, default: 0 },
            duplicateLines: { type: Number, default: 0 },
          },
        },
        lizard: {
          details: {
            line: { type: Number, default: 0 },
            statements: { type: Number, default: 0 },
            complexity: { type: Number, default: 0 },
          },
        },
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

// module.exports = Result = mongoose.model("Result", ResultSchema);
