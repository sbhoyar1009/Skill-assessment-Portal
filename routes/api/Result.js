const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Result = require("../../models/Result");
const Test = require("../../models/Test");
const Track = require("../../models/Track");
const ForkFromMaster = require("../gitlabApis/Fork");
const Competency = require("../../models/Competency");

//This is a custom sorting function for sorting usernames based on total score
function compare(a, b) {
  if (a.totalScore > b.totalScore) {
    return -1;
  }
  if (a.totalScore < b.totalScore) {
    return 1;
  }
  return 0;
}

function compareTitle(a, b) {
  if (a.assignmentTitle > b.assignmentTitle) {
    return 1;
  }
  if (a.assignmentTitle < b.assignmentTitle) {
    return -1;
  }
  return 0;
}

// router.post("/result", async (req, res) => {
//   const result = req.body;
//   try {
//     const existingResult = await Result.findOne({
//       $and: [{ testID: result.testID }, { username: result.username }],
//     });
//     if (!existingResult) {
//       const newResult = await new Result(result);
//       await newResult.save();
//       res.send(newResult);
//     } else {
//       //This sends existing result in case the result already exists
//       res.send(existingResult);
//     }
//   } catch (error) {
//     res.send({ msg: "Error occured while adding result" });
//   }
// });

router.get("/result/:testID/:username/:assignmentID", async (req, resp) => {
  await Result.findOne(
    {
      $and: [{ testID: req.params.testID }, { username: req.params.username }],
    },
    (err, res) => {
      let ResultArray = res.result;
      ResultArray.forEach((element) => {
        if (element.assignmentID === req.params.assignmentID) {
          resp.send(element);
        }
      });
    }
  );
});

//Find result collection by ProjectID and update the result collection and scoreboard
router.post("/result/:projectID", async (req, res) => {
  var assignmentResult = req.body;
  // console.log(req.body)
  var newScore = assignmentResult.cxxtest.summary.score;
  //Below query finds projectID in result array
  try {
    var overAllResult = await Result.findOne({
      "result.projectID": req.params.projectID,
    });
    if (overAllResult) {
      var requiredResult;
      var index; //Index at which we find our desired assignment result
      for (let i = 0; i < overAllResult.result.length; i++) {
        if (overAllResult.result[i].projectID === req.params.projectID) {
          requiredResult = overAllResult.result[i];
          requiredResult.recentScore = newScore;
          requiredResult.attemptNumber += 1;
          index = i;
          break;
        }
      }
      requiredResult.assignmentResult = assignmentResult;

      //To update the best-score,check if the new score is greater than the best score
      if (newScore > requiredResult.bestScore) {
        overAllResult.totalScore += newScore - requiredResult.bestScore;
        requiredResult.bestScore = newScore;
      }
      overAllResult.result[index] = requiredResult;

      var currentdate = new Date();
      var datetime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " @ " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();
      overAllResult.result[index].lastUpdated = datetime;
      overAllResult.updatedOn = new Date(Date.now());
      overAllResult.result[index].submitted = true;
      overAllResult.save();
      res.send(overAllResult);
    } else {
      res.send(null);
    }
    // console.log(overAllResult);
    // res.send(overAllResult);
  } catch (error) {
    console.log("Error:", error);
  }
});

/*
 *For MBD Track
 *Find result collection by ProjectID and update the result collection and scoreboard
 */
router.post("/result/model-based-design/:projectID", async (req, res) => {
  var assignmentResult = req.body;
  var newScore = assignmentResult.summary.score;
  try {
    var overAllResult = await Result.findOne({
      "result.projectID": req.params.projectID,
    });
    if (overAllResult) {
      var requiredResult;
      var index; //Index at which we find our desired assignment result
      for (let i = 0; i < overAllResult.result.length; i++) {
        if (overAllResult.result[i].projectID === req.params.projectID) {
          requiredResult = overAllResult.result[i];
          requiredResult.recentScore = newScore;
          requiredResult.attemptNumber += 1;
          index = i;
          break;
        }
      }
      requiredResult.assignmentResult = assignmentResult;

      //To update the best-score,check if the new score is greater than the best score
      if (newScore > requiredResult.bestScore) {
        overAllResult.totalScore += newScore - requiredResult.bestScore;
        requiredResult.bestScore = newScore;
      }
      overAllResult.result[index] = requiredResult;

      var currentdate = new Date();
      var datetime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        " @ " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();
      overAllResult.result[index].lastUpdated = datetime;
      overAllResult.updatedOn = new Date(Date.now());
      overAllResult.result[index].submitted = true;
      overAllResult.save();
      res.send(overAllResult);
    } else {
      res.status(404).json("Assignment not found");
    }
    // console.log(overAllResult);
    // res.send(overAllResult);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json("Internal Server Error");
  }
});

// Get scoreboard
router.get("/result/:testID", async (req, res) => {
  try {
    const results = await Result.find({ testID: req.params.testID });
    var leaderBoard = [];
    var i = 1;

    results.forEach((result) => {
      var { username, totalScore } = result;
      leaderBoard.push({ username, totalScore });
    });
    leaderBoard = leaderBoard.sort(compare);
    var lastScore = 0;

    if (leaderBoard.length > 0) {
      lastScore = leaderBoard[0].totalScore;
    }
    leaderBoard.forEach((entry, index) => {
      if (entry.totalScore !== lastScore) {
        i += 1;
        lastScore = entry.totalScore;
      }
      leaderBoard[index].rank = i;
    });

    res.send(leaderBoard);
  } catch (error) {
    console.log("Error:", error);
  }
});

//get overall result required at admin side
router.get("/overallresult/:testID", async (req, res) => {
  // req.params.testID = mongoose.Types.ObjectId(req.params.testID);

  try {
    const results = await Result.find({ testID: req.params.testID });
    // console.log(results);
    var leaderBoard = [];
    var i = 1;

    results.forEach((res) => {
      var { username, totalScore, result } = res;
      var userAssignmentResults = [];
      result.forEach((assignment) => {
        // console.log("assignment:", assignment);
        const { assignmentID, assignmentTitle, bestScore, assignmentResult } =
          assignment;
        userAssignmentResults.push({
          assignmentID: assignmentID,
          bestScore: bestScore,
          assignmentTitle: assignmentTitle,
          assignmentResult: assignmentResult,
        });
      });
      userAssignmentResults = userAssignmentResults.sort(compareTitle);
      leaderBoard.push({
        username,
        totalScore,
        userAssignmentResults,
      });
    });
    leaderBoard = leaderBoard.sort(compare);
    var lastScore = 0;

    if (leaderBoard.length > 0) {
      lastScore = leaderBoard[0].totalScore;
    }
    leaderBoard.forEach((entry, index) => {
      if (entry.totalScore !== lastScore) {
        i += 1;
        lastScore = entry.totalScore;
      }
      leaderBoard[index].rank = i;
    });

    await Test.findById(req.params.testID)
      .populate("assignments")
      .exec((err, test) => {
        var assignments = [];
        test.assignments.map((assignment) => {
          assignments.push(assignment.title);
        });
        res.send({ leaderBoard, assignments });
      });
  } catch (error) {
    console.log("Error:", error);
  }
});

router.get("/project/track/:projectID", async (req, res) => {
  let projectID = req.params.projectID;
// https://ecode-gitlab.kpit.com/ecodetestgroup/master-assignments-testing/mbd-test/mbd-test-admin.git
  Track.find({ projectID }, (err, project) => {
    if (err) {
      res.send("Project id is not valid");
    } else {
      res.send(project);
    }
  });
});

// router.post("/competency",async (req, res) => {
//   let data  = new Competency({
//     CompetencyID: 40000003,
//   Competency: "C Language",
//   subcompetencies : [
//     {
//       "SubCompetencyID": "40000000",
//       "SubCompetency": "Constructor & Destructors"
//   },
//   {
//       "SubCompetencyID": "40000032",
//       "SubCompetency": "Inheritance"
//   },
//   {
//       "SubCompetencyID": "40000040",
//       "SubCompetency": "Compile time Polymorphism"
//   },
//   {
//       "SubCompetencyID": "40000045",
//       "SubCompetency": "Runtime Polymorphism"
//   },
//   {
//       "SubCompetencyID": "40000049",
//       "SubCompetency": "Templates"
//   },
//   {
//       "SubCompetencyID": "40000052",
//       "SubCompetency": "Exceptional Handling"
//   },
//   {
//       "SubCompetencyID": "40000057",
//       "SubCompetency": "Identifiers, Keywords and Functions"
//   },
//   {
//       "SubCompetencyID": "40000065",
//       "SubCompetency": "STL"
//   }
//   ]

//   })
//   data.save(function(err,result){
//     if (err){
//         console.log(err);
//     }
//     else{
//         console.log(result)
//     }
// })
// })

module.exports = router;
