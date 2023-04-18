const express = require("express");
const router = express.Router();
const moment = require("moment");
const Result = require("../../models/Result");
const axios = require("axios");
const Assignment = require("../../models/Assignment");
const Competency = require("../../models/Competency");
const today = moment().startOf("day");
const ForkFromMaster = require("../gitlabApis/Fork");
const GetGroupID = require("../gitlabApis/getGroup");
const Test = require("../../models/Test");
const { getsubGroup } = require("../gitlabApis/getsubGroup");
const GetIdByName = require("../gitlabApis/search_name");
/* Find all the results in the database and send them back to the client. */
router.get("/results", async (req, res) => {
  await Result.find({}, (err, results) => {
    if (err) {
      console.log(err.message);
      res.status(500).send("Something went wrong!");
    }
    res.send(results);
  });
});

/* Get the results from the hours mentioned in params and populate the testID, username, totalScore, finYear, result,
assignmentID, assignmentTitle, maxScore, bestScore, attemptNumber, testName, courseName, courseID,
competancy, competencyCode, subCompetency, subCompetencyCode, testEndDate, finYear, cycle,
userAssignmentResults, averageScore, rank. */
router.get("/getresults/fromhours/:hour", async (req, res) => {
  let hour = req.params.hour * 3600000;
  try {
    const results = await Result.find({
      updatedOn: {
        $gte: new Date(Date.now() - hour),
        $lte: new Date(Date.now()),
      },
    }).populate("testID");
    var leaderBoard = [];
    var i = 1;

    results.forEach((res) => {
      let month = res.testID.endTime.getMonth();
      let cycle = "H";
      if (month > 4 && month < 10) {
        cycle = "H1";
      } else if (month >= 10 || month <= 4) {
        cycle = "H2";
      }

      let finYear = res.testID.endTime.getFullYear();
      if (month < 4) {
        finYear = finYear - 1 + "-" + (finYear - 2000);
      } else {
        finYear = finYear + "-" + (finYear - 2000 + 1);
      }

      var { username, totalScore, result } = res;
      let testName = res.testID.displayTitle,
        competency = res.testID.trackName,
        // courseName = res.testID.course,
        courseCode = res.testID.courseID,
        competencyCode = res.testID.competencyCode,
        subCompetency = res.testID.subCompetency,
        subCompetencyCode = res.testID.subCompetencyCode,
        examDate = res.testID.endTime.toLocaleDateString("en-GB");
      var userAssignmentResults = [];
      result.forEach((assignment) => {
        const {
          assignmentID,
          assignmentTitle,
          maxScore,
          bestScore,
          attemptNumber,
        } = assignment;
        userAssignmentResults.push({
          assignmentID: assignmentID,
          bestScore: bestScore,
          maxScore: maxScore,
          assignmentTitle: assignmentTitle,
          attemptNumber,
        });
      });
      userAssignmentResults = userAssignmentResults.sort(compareTitle);
      leaderBoard.push({
        username,
        percentageObtained: totalScore / userAssignmentResults.length,
        testName,
        // courseName,
        courseCode,
        competency,
        competencyCode,
        subCompetency,
        subCompetencyCode,
        examDate,
        finYear,
        cycle,
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

    res.send(leaderBoard);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send("Internal Server Error!");
  }
});

//This is a custom sorting function for sorting usernames based on total score
compare = (a, b) => {
  if (a.totalScore > b.totalScore) {
    return -1;
  }
  if (a.totalScore < b.totalScore) {
    return 1;
  }
  return 0;
};

router.get("/getcoursesofnova", (req, res) => {
  axios
    .get("https://eduonline.kpit.com/api/courses/v1/courses/?org=NOVA")
    .then((r) => {
      res.send({ courses: r.data });
    });
});

compareTitle = (a, b) => {
  if (a.assignmentTitle > b.assignmentTitle) {
    return 1;
  }
  if (a.assignmentTitle < b.assignmentTitle) {
    return -1;
  }
  return 0;
};

router.get("/assignmentList",(req,res)=>{
  AssignmentArray=[]
  Assignment.aggregate([
    { $lookup:
        {
           from: "competencies",
           localField : "Competency",
           foreignField : "Competency",
           as: "Competency",
          //  let : {Competency : "$Competency"}
        },
        
    }
  ]).exec((err,result)=>{
    if (err){
  console.log(err)
    }
  
    CID=0
    subCID = 0
    result.map((ass1)=>{
      // console.log(ass1.subCompetencies)
      if(ass1.level===undefined){
        ass1.level = "L0"
      }
      totalSubComps = ass1.subCompetencies;
      if(Array.isArray(totalSubComps)===false){
        totalSubComps = [totalSubComps]
      }
        subcs = ass1.Competency[0].subcompetencies;
        AssignmentSubComps = []
        // console.log(totalSubComps)
        totalSubComps.forEach(subc=>{
          console.log(subcs)
          var subcomp = subcs.find(SubCompetency=>SubCompetency.SubCompetency==subc)
          // console.log(subcomp)
          AssignmentSubComps.push({
            sub_competency_name : subc,
            sub_competency_code : subcomp.SubCompetencyID
      
          }
            
          )
        })
      

        AssignmentArray.push({ 
          assignment_id:ass1._id,
    assignment_title: ass1.title,
    gitlabUserProjectId : ass1.gitlabUserProjectId,
    competency_name: ass1.Competency[0].Competency,
    competency_code : ass1.Competency[0].CompetencyID,
    sub_competency : AssignmentSubComps,
    level : ass1.level
        })
       
    })
    res.send({"AssignmentList":AssignmentArray})
  })




  Assignment.find({},(err,ass)=>{
    ass.forEach((ass1)=>{
// Competency.findOne({Competency : ass1.Competency},(err,compi)=>{
//   // console.log(compi[0].CompetencyID)
//   CID = compi.CompetencyID;
// })



    
    })
    // res.send({"AssignmentList":AssignmentArray})
  })
  
})

router.post("/createForks",async(req,res)=>{
  // let test = req.body.test;
  // let user = req.body.user;
  // let gitlabUserProjectId = req.body.gitlabUserProjectId;
  // let assignment = {
  //   gitlabUserProjectId : gitlabUserProjectId
  // }
  // console.log(req.body)
  // console.log(req.body.test)
  // let groupName = test.replace(/\s+/g, '').toLowerCase() +"-"+ user.replace(/\s+/g, '').toLowerCase();
  // GetGroupID(groupName).then((res)=>{
  //   console.log(groupName)
  //   console.log(res.data)
  //   let childID = res.data[0].id;
  //   ForkFromMaster(childID,assignment).then((res)=>{
  //     console.log("Fork Successful")
  //   })
  // })

  let data = req.body.data;
  //username,assignments
  let test = 
  {
  title: '',
  displayTitle: '',
  trackName: '', 
  subCompetencyCode: '',
  competencyCode: '',
  subCompetency: '',
  assignments: [ ],
  participants: [],
  course: '',
  courseID: '',
  startTime: '',
  endTime: '',
  createdAt: ''
}
test.participants = data.participants;
test.assignments = data.assignments;
test.startTime = new Date()
test.createdAt = Date.now()
var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + 1, month, day);
test.endTime = c;
// console.log(data);
let assignment = data.assignments

  // console.log(assID)
await  Assignment.findById(assignment[0],async(err,resultAssignment)=>{
    // console.log(resultAssignment);
    test.trackName = resultAssignment.Competency;
    //let title = "Competency Evaluation Test for "+data.participants[0]+" in"+resultAssignment.Competency;
	let title = "Competency Test for "+data.participants[0]+" for "+resultAssignment.title;
    
    await Test.find({title:title},async (err,successTest)=>{
      // console.log(successTest)
      if (err){
        console.log("Error is ",err)
      }
      
      // console.log(successTest.length)
      if(successTest.length>=1){
        // res.send({"Test already exists"})
        res.status(409).send("Test exists")
      }
      // else{
      //   res.send("Test will be created")
      // }

      else{
        test.title = title;
        test.displayTitle  = title;
    await axios({
      method: "post",
      url: `http://localhost:9000/createTest`, 
      // url: "https://ecodeskillportal.kpit.com/createTest",
      withCredentials: true,
      crossdomain: true,
      // headers: { Authorization: "Bearer " + process.env.Token },
      data: {"test":test}
        })
        res.status(200).send({"test" : test})
      }
      
    })

  })
  
})

router.post("/update",(req,res)=>{
  Assignment.find({},(err,ass)=>{
    ass.map(a=>{
      getsubGroup(a.title).then(res=>{
        console.log(a.title,res.data[0].id)
        GetIdByName(a.title.trim(),res.data[0].id).then(resp=>{
          // console.log(a.title,resp.data[0].id)
          let j =resp.data;
          for (let i = 0; i < j.length; i++) {
            // console.log("IF condition",data[i].name.trim() === title.trim());
            if (j[i].name.trim() === a.title.trim()) {
              update = {
                "gitlabUserProjectId" : j[i].id,
                "gitlabGroupId" : res.data[0].id
              }
              filter = {
                "title" : a.title
              }
              Assignment.findOneAndUpdate(filter, update);
          }
        }
        })
      })
 
    })

  })
})



module.exports = router;


