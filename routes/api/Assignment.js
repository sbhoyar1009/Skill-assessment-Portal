const express = require("express"),
  router = express.Router({ mergeParams: true }),
  dotenv = require("dotenv"),
  waterfall = require("async-waterfall");
dotenv.config();
const mongoose = require("mongoose");
const Assignment = require("../../models/Assignment"),
  Test = require("../../models/Test"),
  User = require("../../models/User");
const Competency = require("../../models/Competency");
const DeleteGroup = require("../gitlabApis/deleteGroup");
const GetGroupID = require("../gitlabApis/getGroup");
const {
  getsubGroup,
  getsubGroupsOfGitlab,
} = require("../gitlabApis/getsubGroup");
const GetIdByName = require("../gitlabApis/search_name");

// const VerifyGitLabID = async (req, res, next) => {
//   const assignmentData = req.body;
//   let title = assignmentData.title;
//   let GitLabID = assignmentData.gitlabUserProjectId;
//   let isProjectPresent = false;
//   getsubGroup(title)
//     .then((res1) => {
//       let Groupid;
//       let groups = res1.data;
//       groups.map((group) => {
//         if (group.name.trim() === title.trim()) {
//           Groupid = group.id;
//         }
//       });

//       GetIdByName(title, Groupid)
//         .then((res2) => {
//           let projects = res2.data;
//           projects.map((project) => {
//             if (
//               project.name.trim() === title.trim() &&
//               project.id == GitLabID
//             ) {
//               isProjectPresent = true;
//               return isProjectPresent;
//             }
//           });
//           if (isProjectPresent) {
//             next();
//           } else {
//             console.log("Invalid project id");
//             res.send({ status: "Invalid project id" });
//           }
//         })
//         .catch((err) => {
//           console.log("Invalid project id");
//           res.send({ status: "Invalid project id" });
//         });
//     })
//     .catch((err) => {
//       console.log("Invalid project idt");
//       res.send({ status: "Invalid project id" });
//     });
// };

const getGitLabProjectID = async (req, res, next) => {
  let { title, gitlabUserProjectId, Competency, subCompetencies,level } = req.body;
  subCompetencies = subCompetencies.split(",")
  let gitlabGroupId = gitlabUserProjectId;

  GetIdByName(title, gitlabUserProjectId).then((r) => {
    let data = r.data;
    // console.log(data);
    for (let i = 0; i < data.length; i++) {
      // console.log("IF condition",data[i].name.trim() === title.trim());
      if (data[i].name.trim() === title.trim()) {
        gitlabUserProjectId = data[i].id;
        req.body = {
          title,
          gitlabUserProjectId,
          gitlabGroupId,
          Competency,
          subCompetencies,
          level
        };
        // console.log(req.body);
        break;
      }
    }
    next();
  });
};

//Add assignment to DataBase when admin adds a PDF file to it
router.post("/assignment", getGitLabProjectID, async (req, res) => {
  const pdf = req.files.pdf;
  const assignmentData = req.body;
  console.log(assignmentData);

  let newObj = { ...assignmentData };
  newObj.maxScore = 100;

  if (pdf) {
    pdf.mv("uploads/" + assignmentData.title + ".pdf", (err) => {
      if (err) {
        console.log("Error while uploading PDF");
      } else {
        console.log("PDF uploaded");
      }
    });
  }

  Assignment.create(newObj, (err, ass) => {
    if (err) {
      console.log(err);
      res.send({ status: "Error while creating assignment" });
    } else {
      ass.save();
      console.log(`Assignment created Successfully!!! ${ass.title}`);
      res.send({ status: "success" });
    }
  });
});

//Fetch all assignments
router.get("/assignments", async (req, res) => {
  let comp = req.params.competency;
  // let subc = req.params.subCompetency;
  await Assignment.find({}, (err, assgns) => {
    res.send(assgns);
  });
});

// router.get("/assignments/:competency/:subCompetency", async (req, res) => {
//   let comp = req.params.competency;
//   let subc = req.params.subCompetency;
//   console.log(subc)
//   console.log(comp, subc);
//   await Assignment.find(
//     { Competency: comp, subCompetency: subc },

//     (err, assgns) => {
//       console.log(assgns);
//       res.send(assgns);
//     }
//   );
// });

router.get("/assignments/:competency", async (req, res) => {
  let comp = req.params.competency;

  console.log(comp)
  await Assignment.find(
    { Competency: comp },

    (err, assgns) => {
      console.log(assgns);
      res.send(assgns);
    }
  );
});

//Fetch one Assignment using ID
router.get("/assignment/:id", async (req, res) => {
  await Assignment.findOne({ _id: req.params.id }, (err, assgn) => {
    if (err) {
      console.log(err);
    } else {
      res.send(assgn);
    }
  });
});

//delete Assignment using ID
router.delete("/assignment/delete/:id", async (req, res) => {
  await Assignment.deleteOne({ _id: req.params.id }, (err, assgn) => {
    if (err) {
      console.log(err);
    } else {
      console.log(assgn);
    }
  });
});

//Fetch an Assignment using ID
router.get("/assignment/:id", async (req, res) => {
  await Assignment.findOne({ _id: req.params.id }, (err, assgn) => {
    if (err) {
      console.log(err);
    } else {
      res.send(assgn);
    }
  });
});

// Fectch all the Assignments of a Test
router.get("/getAssignmentsofTest/:testId", async (req, res) => {
  await Test.findById(req.params.testId)
    .populate("assignments")
    .exec((err, assignments) => {
      res.send(assignments);
    });
});

router.post("/checkassignment", (req, res) => {
  let userEnteredTitle = req.body.assignmentName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
  let assignmentPresent = false;
  Assignment.find((err, assignments) => {
    if (err) {
      console.log(err);
      res.send({ status: true });
    } else {
      for (let i = 0; i < assignments.length; i++) {
        const title = assignments[i].title
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-");
        if (title === userEnteredTitle) {
          assignmentPresent = true;
          break;
        }
      }
      res.send({ status: assignmentPresent });
    }
  });
});

const deleteAssignmentGroup = (req, res, next) => {
  let { title, gitlabGroupId, _id } = req.body;

  DeleteGroup(gitlabGroupId)
    .then((res) => {
      if (res.data) {
        Test.find({}, (err, tests) => {
          tests.forEach((t) => {
            if (t.assignments.includes(_id)) {
              t.assignments.remove(_id);
              let _id1 = t._id;
              Test.findByIdAndUpdate(_id1, t, (err, updated) => {
                if (err) {
                  console.log(err);
                } else {
                  //console.log(updated);
                }
              });
            }
          });
          next();
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({ status: "error", msg: "Error while deleting Assignment" });
    });
};

router.post("/deleteassignment", deleteAssignmentGroup, (req, res) => {
  let { title, gitlabGroupId, _id } = req.body;
  console.log(req.body);
  Assignment.findOneAndDelete({ _id }, (err, r) => {
    if (err) {
      res.send({ status: "error", msg: "Error while deleting Assignment" });
    }
    res.send({ status: "success", msg: "Assignment deleted successfully" });
  });
});

router.post("/deleteassignments/:testID", (req, res) => {
  let assignmentIDs = req.body;
  Test.findById(req.params.testID, (err, test) => {
    if (err) {
      console.log(err);
      res.send({
        status: "error",
        message: "Error while deleting assignment from test",
      });
    } else {
      assignmentIDs.map((id) => {
        test.assignments.remove(id);
      });
      Test.findByIdAndUpdate(req.params.testID, test, (err, updated) => {
        if (err) {
          res.send({
            status: "error",
            message: "Error while deleting assignment from test",
          });
        } else {
          res.send({
            status: "success",
            message: "Assignment deleted successfully",
          });
        }
      });
    }
  });
});

router.post("/deleteassignment/:testID/:assignmentID", (req, res) => {
  Test.findById(req.params.testID, (err, test) => {
    if (err) {
      console.log(err);
      res.send({
        status: "error",
        message: "Error while deleting assignment from test",
      });
    } else {
      test.assignments.remove(req.params.assignmentID);
      Test.findByIdAndUpdate(req.params.testID, test, (err, updated) => {
        if (err) {
          res.send({
            status: "error",
            message: "Error while deleting assignment from test",
          });
        } else {
          res.send({
            status: "success",
            message: "Assignment deleted successfully",
          });
        }
      });
    }
  });
});

const getlistofAssignmentsGroups = (req, res, next) => {
  let groups = [];
  getsubGroupsOfGitlab()
    .then((r) => {
      let data = r.data;
      for (let i = 0; i < data.length; i++) {
        groups.push({ name: data[i].name, id: data[i].id });
      }
      req.groups = groups;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
};

// Fectch all the Assignments Present on gitlab
router.get(
  "/getAssignmentsGroupsOfGitlab",
  getlistofAssignmentsGroups,
  async (req, res) => {
    if (req.groups) {
      res.send(req.groups);
    }
  }
);

router.post("/changePDF", (req, res) => {
  console.log(req.body);
  title = req.body.title;
  console.log(req.files);
  const pdf = req.files.pdf;
  if (pdf) {
    pdf.mv("uploads/" + title + ".pdf", (err) => {
      if (err) {
        console.log("Error while uploading PDF");
        res.send({
          status: "error",
          message: "Unable to replace PDF",
        });
      } else {
        res.send({
          status: "success",
          message: "PDF updated successfully",
        });
      }
    });
  } else {
    console.log("NO PDF");
    res.send({
      status: "error",
      message: "NO PDF",
    });
  }
});

router.get("/allSubCompetencies/:assignmentID",async(req,res)=>{
  let assignmentID = req.params.assignmentID;
  let subcomps =[]
  console.log(assignmentID);
   await Assignment.findById(assignmentID,(err,assign)=>{
      console.log(assign)
      subcomps.push(...(assign.subCompetencies))
      console.log("Subcomps recieved",assign.subCompetencies)
    })
  res.send(subcomps)
})

module.exports = router;
