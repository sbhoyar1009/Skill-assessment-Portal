const mongoose = require("mongoose");

// const track = new mongoose.Schema({});
const TestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  displayTitle: {
    type: String,
  },
  courseCode: {
    type: String,
  },
  //The track name should be referred as the competency name
  trackName: {
    type: String,
    required: true,
  },
  competencyCode: {
    type: Number,
  },
  subCompetencyCode: {
    type: Number,
  },
  subCompetency: [{
    type: String,
    // required: true,
  }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
  participants: [
    {
      type: String,
      required: true,
    },
  ],
  // course: {
  //   type: String,
  //   required: true
  // },
  courseID: {
    type: String,
    // required: true
  },
  duration: Number, //duration unit is not yet decided (HRS/MINS)
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: false,
  },
  isHidden :{
    type: Boolean,
    // required: true,
    default: false,
  },
  maxScore: {
    type: Number,
    default: 100,
  },
  createdAt: Date,
});

module.exports = Test = mongoose.model("Test", TestSchema);
