const express = require("express");
const router = express.Router({ mergeParams: true });
const Assignment = require("../../models/Assignment");
const Result = require("../../models/Result");
const Test = require("../../models/Test");
const User = require("../../models/User");
const createGroup = require("../gitlabApis/create_group");
const AddingAMember = require("../gitlabApis/giveAccesstoTest");
const DeletingAMember = require("../gitlabApis/revokeAccesstoTest");
const { checkUserList } = require("../gitlabApis/user");
const ForkFromMaster = require("../gitlabApis/Fork");
const GetGroupID = require("../gitlabApis/getGroup");
const DeleteGroup = require("../gitlabApis/deleteGroup");
const getUserEmail = require("../gitlabApis/getUserEmail");
const schedule = require("node-schedule");
const nodeMailer = require("nodemailer");
const cron = require("node-cron");
const waterfall = require("async-waterfall");
const Track = require("../../models/Track");
const Competency = require("../../models/Competency");

// A function to activate and deactivate the tests automatically
const activateTest = async () => {
  await Test.find({}, (err, allTests) => {
    try {
      let currentDate = new Date(Date.now()).toString().slice(0, 21);

      allTests.forEach((test) => {
        let startDate = new Date(test.startTime).toString().slice(0, 21);
        let endDate = new Date(test.endTime).toString().slice(0, 21);

        if (startDate == currentDate) {
          test.isActive = true;
          console.log(test.isActive);
          Test.findByIdAndUpdate(test._id, test, (err, updatedTest) => {
            addUserToTest(updatedTest, updatedTest.participants);
            // console.log("Test updated!");
          });
        } else if (endDate == currentDate) {
          test.isActive = false;
          console.log(test.isActive);
          Test.findByIdAndUpdate(test._id, test, (err, updatedTest) => {
            deleteUserToTest(updatedTest, updatedTest.participants);
            console.log("Test updated!");
          });
        }
      });
    } catch (e) {
      console.log("Error: ", e);
    }
  });
};

// A constantly running function for activating and deactivating the Tests using Node-cron
//The function is executed in every single minute
cron.schedule("* * * * *", () => {
  // console.log("Checking for tests to activate and de-activate.");
  activateTest();
});

// Creating and configuring SMTP server for sending mails
// to the participants whenever any test is assigned to them
const smtpTransport = nodeMailer.createTransport({
  host: "hjph3hive",
  port: 10025,
});

//From the Excel, add users which are not present in the Database
const createUser = async (UserArray, test) => {
  await UserArray.forEach((user) => {
	  console.log(user)
     getUserEmail(user).then((res) => {
		console.log(user,res.data[0].email)
      newUser = {
        username: user,
        Tests: [test],
        email: res.data[0].email,
      };
      User.findOne({ username: user }, (err, u) => {
        if (u) {
          let flag = 0;

          // console.log("Test is", test);
          for (let i = 0; i < u.Tests.length; i++) {
            if (u.Tests[i].equals(test)) {
              flag = 1;
              break;
            }
          }

          if (flag == 0) {
            u.Tests.push(test);
            u.save();
          }
        } else {
          User.create(newUser, (err, user) => {
            if (err) {
              console.log(err);
            } else {
            }
          });
        }
      });
    }).catch((err)=>{console.log("Error")});
  });
};

// const CheckForks = (test, username) => {
//   Result.findOne({ testID: test._id, username: username }, (err, Res) => {
//     if (err) {
//       console.log(err);
//     } else {
//       let assignmentsForked = [];
//       let assignmentsToBeForked = [];
//       Res.result.map((assignment) => {
//         assignmentsForked.push(assignment.assignmentTitle);
//       });

//       if (test.assignments.length !== Res.result.length) {
//         test.assignments.map((assignment) => {
//           if (assignmentsForked.includes(assignment.title)) {
//             assignmentsToBeForked.push({
//               title: assignment.title,
//               id: assignment._id,
//               gitlabUserProjectId: assignment.gitlabUserProjectId,
//             });
//           }
//         });
//       }

//       console.log("Forked : ", assignmentsForked);
//       console.log("Not Forked : ", assignmentsToBeForked);
//     }
//   });
// };

// router.post("/createforks/:testID/:username", async (req, res) => {
//   let _id = req.params.testID;
//   let username = req.params.username;
//   await Test.findById(_id, (err, test) => {
//     if (err) {
//       console.log(err);
//     } else {
//       CheckForks(test, username);
//     }
//   });
// });

//Create a Group for Test+User and a Project for Assignment. Clone and push them for first first user,fork them for rest.
const CreateGroupandProject = async (test) => {
  // console.log("TEST : ", test);
  let testName = test.title;
  let Assignments = []; // Store only the names of the Assignment in the array
  test.assignments.map(async (assignment) => {
    try {
      let currentAssignment = await Assignment.findOne({ _id: assignment });
      if (currentAssignment) {
        let newAssignmentName = currentAssignment.title
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-");

        Assignments.push({
          title: currentAssignment.title,
          id: currentAssignment._id,
          gitlabUserProjectId: currentAssignment.gitlabUserProjectId,
        });
      }
    } catch (error) {
      console.log("Error while cloning assignment:", error);
    }
  });

  test.participants.map((username, index) => {
    let month = test.endTime.getMonth();
    let finYear = test.endTime.getFullYear();
    if (month < 4) {
      finYear = finYear - 1 + "-" + finYear;
    } else {
      finYear = finYear + "-" + (finYear + 1);
    }
    let initialResult = {
      username: username,
      result: [],
      testID: test._id,
      // testName: test.displayTitle,
      // competancy: test.trackName,
      // competencyCode: test.competencyCode,
      // subCompetencyCode: test.subCompetencyCode,
      // subCompetency: test.subCompetency,
      // courseID : test.courseID,
      // testEndDate: test.endTime,
      finYear: finYear,
      totalScore: 0,
      groupID: null,
    };

    let newGroupID = null;
    let groupName =
      testName.toLowerCase().trim().replace(/\s+/g, "") +
      "-" +
      username.toLowerCase().trim();
    createGroup(groupName)
      .then(async (res) => {
        if (res.data.id) {
          newGroupID = res.data.id;
          initialResult.groupID = newGroupID;
          Assignments.map(async (assignment) => {
            await ForkFromMaster(newGroupID, assignment)
              .then((res) => {
                initialResult.result.push({
                  projectID: res.data.id, //add project ID of GitLab to result
                  assignmentID: assignment.id, //add assignment ID to result
                  assignmentTitle: assignment.title,
                  maxScore: 100,
                });

                let newTrackProject = Track({
                  projectID: res.data.id,
                  trackName: test.trackName,
                  adminURL: `${process.env.ADMINGITLABURL}/${assignment.title
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-")}/${
                    assignment.title.toLowerCase().trim().replace(/\s+/g, "-") +
                    "-admin.git"
                  }`,
                });

                newTrackProject.save();

                Result.findOneAndUpdate(
                  { testID: test._id, username: username },
                  { result: initialResult.result },
                  (err, updated) => {
                    if (err) {
                      console.log("Error while updating result :", err);
                    } else {
                      //console.log("Updated Result : ", updated);
                    }
                  }
                );
                // console.log(initialResult);
              })
              .catch((err) => {
                console.log("Error while forking project : ", err);
              });
          });

          // let result = await new Result(initialResult);
          await Result.create(initialResult, (err, result) => {
            if (err) {
              console.log("Error while creating result : ", err);
            } else {
              // console.log("result :", result);
            }
          });
        }
      })
      .catch((err) => {
        console.log("Error while creating group : ", err);
      });
  });
};

//function for sending the mail notifications to participants of the test
const sendNotification = async (testData) => {
  testData.participants.forEach((participant) => {
    User.findOne({ username: participant }, (err, user) => {
      if (err) {
        console.log("Error in finding User: ", err.message);
        res.status(500).send("Something went wrong!");
      } else {
		  if(user){
		  console.log("Line 274",user)
        let mailOptions = {
          to: user.email,
          from: "ecodeskillportal@kpit.com",
          subject: "Ecode Skill Assessment - You've been assigned a Test",
          // text: `Dear ${user.name},\n
          //        You have been assigned a Test named "${
          //          testData.title
          //        }" on Ecode Skill Assessment Portal.\n
          //        The test will start on ${testData.startTime.toDateString()} at ${testData.startTime.toTimeString()}.\n
          //        Block your calendar on the above mentioned Date & Time and be prepared for the Test.\n\n
          //        All the Best!\n\n
          //        This is an auto generated mail. Do not reply`,
          html: `<div style="border: 1px solid black; line-height: 1.5;">                    
                    <p style="padding: 2rem;">Dear ${user.name},<br><br>
                    You have been assigned a Test named <strong>"${
                      testData.title
                    }"</strong> on Ecode Skill Assessment Portal. <br><br>
                    The test will start on ${testData.startTime.toDateString()} at ${testData.startTime
            .toTimeString()
            .slice(
              0,
              5
            )} till ${testData.endTime.toDateString()} at ${testData.endTime
            .toTimeString()
            .slice(0, 5)}. <br><br>
                    Block your calendar on the above mentioned Date & Time and be prepared for the Test. <br><br>
                    All the Best! <br><br>
                    <span style="font-style: italic; color:blue">This is an auto generated mail. Do not reply.</span></p>                    
                </div>`,
        };
        smtpTransport.sendMail(mailOptions, (err, success) => {
          if (err) {
            console.log("error: ", err.message);
            // res.send({ status: "error", msg: "Something went wrong!" });
          } else {
            // console.log("Mail got delievered!!!");
          }
        });
	  }
      }
    });
  });
};

router.post("/createTest", async (req, res) => {
  let test = req.body.test;
  Competency.find({ Competency: test.trackName }, (err, compt) => {
    if (err) {
      throw err;
    }
    test.competencyCode = compt[0].CompetencyID;
    // subcomps = compt[0].subcompetencies;
    // let obj = subcomps.find(
    //   ({ SubCompetency }) => SubCompetency === test.subCompetency
    // );
    // console.log(obj);
    // test.subCompetencyCode = obj.SubCompetencyID;
    // subcomps.find({"subCompetency":test.subCompetency},(err,subcomps)=>{
    //   if(err){throw err;}
    //   test.subCompetencyCode = subcomps.subCompetencyID;
    // })
  });

  const participants = [...new Set(test.participants)];
  //Get object list of both valid and invalid usernames
  const { validUsernames, invalidUsernames } = await checkUserList(
    participants
  );
  test.participants = [...new Set(validUsernames)];
  let newTest = await new Test(test);
  // let testID = newTest._id;
  // schedule.scheduleJob(newTest.startTime, () => {
  //   ActivateTest(testID);
  // });
  // schedule.scheduleJob(newTest.endTime, () => {
  //   DeactivateTest(testID);
  // });
  await newTest.save();

  // await createUser(newTest.participants, emails, newTest._id);
  await createUser(newTest.participants, newTest._id);
  await CreateGroupandProject(newTest);
  await sendNotification(newTest);

  // console.log(`Test named ${newTest.title} created successfully!`);
  res.send({ status: "success", invalidUsernames });
});

const AddParticipantsAndForkProjects = async (req, res, next) => {
  let addParticipants = req.body.participants;
  const { validUsernames, invalidUsernames } = await checkUserList(
    addParticipants
  );
  addParticipants = validUsernames;

  await Test.findById(req.params.testId, async (err, test) => {
    if (err) {
      console.log(err);
      res.send("Error!!!");
    } else {
      let testParticipants = [
        ...new Set([...test.participants, ...addParticipants]),
      ];
      // await createUser(addParticipants, emails, test._id);
      await createUser(addParticipants, test._id);
      test.participants = testParticipants;
      test.save();

      //update this call after usernames validation(check if it is already present in test or not)
      await CreateGroupandProject({
        _id: test._id,
        participants: addParticipants,
        assignments: test.assignments,
        title: test.title,
        trackName: test.trackName,
        startTime: test.startTime,
        endTime: test.startTime,
        displayTitle: test.displayTitle,
        competencyCode: test.competencyCode,
        subCompetencyCode: test.subCompetencyCode,
        subCompetency: test.subCompetency,
      });

      await sendNotification({
        _id: test._id,
        participants: addParticipants,
        assignments: test.assignments,
        title: test.title,
        trackName: test.trackName,
        startTime: test.startTime,
        endTime: test.startTime,
        displayTitle: test.displayTitle,
      });

      next();
    }
  });
};

router.post(
  "/test/addparticipants/:testId",
  AddParticipantsAndForkProjects,
  async (req, res) => {
    let addParticipants = req.body.participants;
    const { validUsernames, invalidUsernames } = await checkUserList(
      addParticipants
    );
    addParticipants = validUsernames;

    let _id = req.params.testId;
    Test.findById(req.params.testId, async (err, test) => {
      if (err) {
        console.log(err);
        res.send("Error!!!");
      } else {
        if (test.isActive) {
          // console.log("Adding Participants");
          addUserToTest(test, addParticipants);
        }

        res.send({ status: "success", invalidUsernames });
      }
    });
  }
);

router.post("/checktest", (req, res) => {
  Test.findOne({ title: req.body.testName }, (err, test) => {
    if (err) {
      console.log(err);
    } else {
      if (test) {
        res.send({ status: true });
      } else {
        res.send({ status: false });
      }
    }
  });
});

router.get("/getTests", async (req, res) => {
  let tests = await Test.find({}).sort({ _id: -1 }).exec();
  res.send(tests);
});

router.get("/getTestsofUser/:userId", async (req, res) => {
  User.findById(req.params.userId)
    .populate("Tests")
    .exec((err, Tests) => {
      if (err) {
        console.log(err);
      } else {
        let test = Tests.Tests;
        let UnhiddenTest = test.filter((test) => test.isHidden == false);
        res.send(UnhiddenTest);
      }
    });
});

router.get("/gettest/:testId", async (req, res) => {
  await Test.findById(req.params.testId, (err, test) => {
    if (err) {
      console.log(err);
    } else {
      res.send(test);
    }
  });
});

// Give user access to test on the toggle button
const addUserToTest = async (test, users) => {
  let testName = test.title;
  // let users = test.participants;

  users.map((user) => {
    let accessGiven = AddingAMember(
      user.trim(),
      testName.toLowerCase().trim().replace(/\s+/g, "") +
        "-" +
        user.toLowerCase().trim()
    );
  });
};

// Revoke user access to test on the toggle button
const deleteUserToTest = async (test, users) => {
  let testName = test.title;
  // let users = test.participants;
  console.log(users);
  users.map((user) => {
    let accessGiven = DeletingAMember(
      user.trim(),
      testName.toLowerCase().trim().replace(/\s+/g, "") +
        "-" +
        user.toLowerCase().trim()
    );
  });
};

// router.post("/setActive/:testId", async (req, res) => {
//   let test = req.body;
//   test.isActive = !test.isActive;
//   Test.findByIdAndUpdate(req.params.testId, test, (err, Updated) => {
//     if (err) {
//       console.log(err);
//     } else {
//       if (test.isActive) {
//         addUserToTest(Updated, Updated.participants);
//       } else {
//         deleteUserToTest(Updated, Updated.participants);
//       }
//     }
//   });
// });
router.post("/setActive/:testId", async (req, res) => {
  let test = req.body;
  console.log(
    Date.now() > new Date(test.startTime) && Date.now() < new Date(test.endTime)
  );
  if (
    Date.now() > new Date(test.startTime) &&
    Date.now() < new Date(test.endTime)
  ) {
    test.isActive = true;
    Test.findByIdAndUpdate(req.params.testId, test, (err, Updated) => {
      if (err) {
        console.log(err);
      } else {
        addUserToTest(Updated, Updated.participants);
        res.send({ status: "success", msg: "Test Activated Successfully" });
      }
    });
  } else {
    res.send({
      status: "error",
      msg: "Test cannot be activated before start time and after end time",
    });
  }
});
router.post("/setInActive/:testId", async (req, res) => {
  let test = req.body;
  test.isActive = false;
  Test.findByIdAndUpdate(req.params.testId, test, (err, Updated) => {
    if (err) {
      console.log(err);
      res.send({ status: "error", msg: "Error while Deactivating test" });
    } else {
      deleteUserToTest(Updated, Updated.participants);
      res.send({ status: "success", msg: "Test Deactivated Successfully" });
    }
  });
});

router.post("/istestactive", async (req, res) => {
  await Test.findById(req.body.testId, (err, test) => {
    if (err || test === null || test === undefined) {
      console.log(err);
      res.send({ isActive: false });
    } else {
      res.send({ isActive: test.isActive });
    }
  });
});

// const DeleteGroupOfUser = (req, res, next) => {
//   Test.findById(req.params.testID, (err, test) => {
//     let GroupName =
//       test.title.toLowerCase().trim().replace(/\s+/g, "") +
//       "-" +
//       req.params.username.toLowerCase().trim();

//     GetGroupID(GroupName)
//       .then((r) => {
//         let groups = r.data;
//         let groupID;
//         for (let i = 0; i < groups.length; i++) {
//           if (groups[i].name === GroupName) {
//             groupID = groups[i].id;
//             break;
//           }
//         }
//         if (groupID) {
//           DeleteGroup(groupID)
//             .then((res) => {
//               if (res.data) {
//                 next();
//               }
//             })
//             .catch((err) => {
//               console.log(err);
//               res.send({
//                 status: "error",
//                 message: "Error while removing participant",
//               });
//             });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         res.send({
//           status: "error",
//           message: "Error while removing participant",
//         });
//       });
//   });
// };

router.post("/deleteparticipant/:testID/:username", async (req, res) => {
  console.log(req.params.username);
  await Test.findById(req.params.testID, (err, test) => {
    if (err) {
      console.log(err);
      res.send({
        status: "error",
        message: "Error while removing participant",
      });
    } else {
      req.params.username.split(",").map((singleUser) => {
        test.participants.remove(singleUser);
      });

      // let usernames = req.params.username;
      // usernames.map((user)=>{
      //   test.participants.remove(user);
      // });

      Test.findByIdAndUpdate(req.params.testID, test, (err, updated) => {
        if (err) {
          console.log(err);
          res.send({
            status: "error",
            message: "Error while removing participant",
          });
        } else {
          // console.log(updated);
          let usernames = req.params.username.split(",");
          console.log(usernames);
          usernames.map((user1) => {
            User.findOne({ username: user1 }, (err, user) => {
              user.Tests.remove(req.params.testID);
              User.findOneAndUpdate(
                { username: user1 },
                user
                // ,
                // (err, updatedUser) => {
                //   if (err) {
                //     console.log(err);
                //     res.send({
                //       status: "error",
                //       message: "Error while removing participant",
                //     });
                //   } else {
                //     res.send({
                //       status: "success",
                //       message: "Participant removed successfully!",
                //     });
                //   }
                // }
              );
            });
          });
          res.send({
            status: "success",
            message: "Participant removed successfully!",
          });
        }
      });
    }
  });
});

// router.post("/deleteparticipant/:testID/:username", async (req, res) => {
//   console.log(req.params.username)
//   await Test.findById(req.params.testID, (err, test) => {
//     if (err) {
//       console.log(err);
//       res.send({
//         status: "error",
//         message: "Error while removing participant",
//       });
//     } else {
//       test.participants.remove(req.params.username);
//       Test.findByIdAndUpdate(req.params.testID, test, (err, updated) => {
//         if (err) {
//           console.log(err);
//           res.send({
//             status: "error",
//             message: "Error while removing participant",
//           });
//         } else {
//           // console.log(updated);
//           User.findOne({ username: req.params.username }, (err, user) => {
//             user.Tests.remove(req.params.testID);
//             User.findOneAndUpdate(
//               { username: req.params.username },
//               user,
//               (err, updatedUser) => {
//                 if (err) {
//                   console.log(err);
//                   res.send({
//                     status: "error",
//                     message: "Error while removing participant",
//                   });
//                 } else {
//                   res.send({
//                     status: "success",
//                     message: "Participant removed successfully!",
//                   });
//                 }
//               }
//             );
//           });
//         }
//       });
//     }
//   });
// });

const addAssignmentsToTest = (req, res, next) => {
  Test.findById(req.body.testId, async (err, test) => {
    if (err) {
      console.log(err);
      res.send({ status: "error", msg: "Error while adding assignments!!" });
    } else {
      let participants = test.participants;
      console.log(participants);

      let assignments = req.body.assignments;
      let Assignments = [];

      assignments.map(async (assignment) => {
        try {
          let currentAssignment = await Assignment.findOne({
            _id: assignment,
          });
          if (currentAssignment) {
            let newAssignmentName = currentAssignment.title
              .toLowerCase()
              .trim()
              .replace(/\s+/g, "-");

            Assignments.push({
              title: currentAssignment.title,
              id: currentAssignment._id,
              gitlabUserProjectId: currentAssignment.gitlabUserProjectId,
            });
          }
        } catch (error) {
          console.log("Error while cloning assignment:", error);
        }
      });

      participants.forEach((username) => {
        console.log(username);
        Result.findOne(
          { testID: req.body.testId, username: username },
          (err, totalResult) => {
            let result = totalResult.result;
            let groupID = totalResult.groupID;

            Assignments.map(async (assignment) => {
              ForkFromMaster(groupID, assignment)
                .then((res) => {
                  result.push({
                    projectID: res.data.id, //add project ID of GitLab to result
                    assignmentID: assignment.id, //add assignment ID to result
                    assignmentTitle: assignment.title,
                    maxScore: 100,
                  });

                  let newTrackProject = Track({
                    projectID: res.data.id,
                    trackName: test.trackName,
                  });

                  newTrackProject.save();

                  Result.findOneAndUpdate(
                    { testID: test._id, username: username },
                    { result: result },
                    (err, updated) => {
                      if (err) {
                        console.log("Error while updating result :", err);
                      } else {
                        // console.log("Updated Result : ", updated);
                      }
                    }
                  );
                  // console.log(initialResult);
                })
                .catch((err) => {
                  console.log("Error while forking project : ", err);
                });
            });
          }
        );
      });
    }

    next();
  });
};

router.post(
  "/addAssignments/test/:testID",
  addAssignmentsToTest,
  async (req, res) => {
    Test.findById(req.body.testId, async (err, test) => {
      if (err) {
        console.log(err);
        res.send({ status: "error", msg: "Error while adding assignments!!" });
      } else {
        let assignments = [...test.assignments, ...req.body.assignments];

        Test.findByIdAndUpdate(
          req.body.testId,
          { assignments },
          (err, test) => {
            if (err) {
              console.log(err);
              res.send({
                status: "error",
                msg: "Error while adding assignments!!",
              });
            } else {
              res.send({
                status: "success",
                msg: "Assignments added successfully!",
              });
            }
          }
        );
      }
    });
  }
);

const CheckForks = (test, username) => {
  Result.findOne({ testID: test._id, username: username }, (err, Res) => {
    if (err) {
      console.log(err);
    } else {
      let assignmentsForked = [];
      let assignmentsToBeForked = [];
      if (Res !== null) {
        Res.result.map((assignment) => {
          assignmentsForked.push(assignment.assignmentTitle);
        });

        if (test.assignments.length != Res.result.length) {
          test.assignments.map((assignment) => {
            if (!assignmentsForked.includes(assignment.title)) {
              assignmentsToBeForked.push({
                title: assignment.title,
                id: assignment._id,
                gitlabUserProjectId: assignment.gitlabUserProjectId,
              });
            }
          });
        }

        let GroupId = Res.groupID;
        let initialResult = {
          username: username,
          result: Res.result,
          testID: test._id,
          totalScore: 0,
          groupID: GroupId,
        };

        assignmentsToBeForked.map(async (assignment) => {
          await ForkFromMaster(GroupId, assignment)
            .then((res) => {
              initialResult.result.push({
                projectID: res.data.id, //add project ID of GitLab to result
                assignmentID: assignment.id, //add assignment ID to result
                assignmentTitle: assignment.title,
              });

              let newTrackProject = Track({
                projectID: res.data.id,
                trackName: test.trackName,
                adminURL: `${process.env.ADMINGITLABURL}/${assignment.title
                  .toLowerCase()
                  .trim()
                  .replace(/\s+/g, "-")}/${
                  assignment.title.toLowerCase().trim().replace(/\s+/g, "-") +
                  "-admin.git"
                }`,
              });

              newTrackProject.save();

              Result.findOneAndUpdate(
                { testID: test._id, username: username },
                { result: initialResult.result },
                (err, updated) => {
                  if (err) {
                    console.log("Error while updating result :", err);
                  } else {
                    // console.log("Updated Result : ", updated);
                  }
                }
              );
              // console.log(initialResult);
            })
            .catch((err) => {
              console.log("Error while forking project : ", err);
            });
        });
      }
    }
  });
};

router.post("/createforks/:testID/:username", async (req, res) => {
  let _id = req.params.testID;
  let username = req.params.username;
  await Test.findById(_id)
    .populate("assignments")
    .exec((err, test) => {
      CheckForks(test, username);
      res.send({ status: "success" });
    });
});

router.post("/createforksforallusers/:testID", async (req, res) => {
  let _id = req.params.testID;
  await Test.findById(_id)
    .populate("assignments")
    .exec((err, test) => {
      test.participants.map((username) => {
        CheckForks(test, username);
      });
      res.send({ status: "success" });
    });
});

// router.post("/addassignment/:testid", async (req, res) => {});

//send notification if admin updates the Test Details
const sendUpdateNotification = async (testData) => {
  testData.participants.forEach((participant) => {
    User.findOne({ username: participant }, (err, user) => {
      if (err) {
        console.log("Error in finding User: ", err.message);
        res.status(500).send("Something went wrong!");
      } else {
        let mailOptions = {
          to: user.email,
          from: "ecodeskillportal@kpit.com",
          subject: "Ecode Skill Assessment - Updates in the assigned Test",
          // text: `Dear ${user.name},\n
          //        You have been assigned a Test named "${
          //          testData.title
          //        }" on Ecode Skill Assessment Portal.\n
          //        The test will start on ${testData.startTime.toDateString()} at ${testData.startTime.toTimeString()}.\n
          //        Block your calendar on the above mentioned Date & Time and be prepared for the Test.\n\n
          //        All the Best!\n\n
          //        This is an auto generated mail. Do not reply`,
          html: `<div style="border: 1px solid black; line-height: 1.5;">                    
                    <p style="padding: 2rem;">Dear ${user.name},<br><br>
                    Your assigned Test <strong>"${
                      testData.title
                    }"</strong> on Ecode Skill Assessment Portal has some updates in it. <br><br/>
                    The test will start on ${testData.startTime.toDateString()} at ${testData.startTime
            .toTimeString()
            .slice(
              0,
              5
            )} till ${testData.endTime.toDateString()} at ${testData.endTime
            .toTimeString()
            .slice(0, 5)}.<br><br>
                    Block your calendar on the above mentioned Date & Time and be prepared for the Test. <br><br>
                    All the Best! <br><br>
                    <span style="font-style: italic; color:blue">This is an auto generated mail. Do not reply.</span></p>                    
                </div>`,
        };
        smtpTransport.sendMail(mailOptions, (err, success) => {
          if (err) {
            console.log("error: ", err.message);
            // res.send({ status: "error", msg: "Something went wrong!" });
          } else {
            // console.log("Mail got delievered!!!");
          }
        });
      }
    });
  });
};

router.put("/update/:testId", async (req, res) => {
  // console.log(req.body);
  await Test.findByIdAndUpdate(
    req.params.testId,
    req.body.data,
    (err, updated) => {
      if (err) {
        console.log(err);
        res.send({ status: "error", msg: "Something went wrong!" });
      }
    }
  );

  await Test.findById(req.params.testId, (err, test) => {
    if (err) {
      console.log(err);
      res.send({ status: "error", msg: "Something went wrong!" });
    } else {
      // console.log(test);
      sendUpdateNotification(test);
      res.send({
        status: "success",
        updatedTest: test,
      });
    }
  });
});

router.get("/competency", async (req, res) => {
  try {
    let competency = [];
    Competency.find({}, (err, comp) => {
      if (err) {
        res.send(err);
      } else {
        comp.map((obj) => {
          // console.log(obj.Competency)
          competency.push(obj.Competency);
          //  console.log(obj)
        });
        res.send(competency);
      }
    });
  } catch (err) {
    console.log("Error");
  }
});

router.get("/subcompetency/:competency", async (req, res) => {
  try {
    let compt = req.params.competency;
    let subcompt = [];
    Competency.find({ Competency: compt }, (err, comp) => {
      if (err) {
        throw err;
      } else {
        comp.map((c) => {
          subc = c.subcompetencies;
          // console.log(subc)
          subc.map((subs) => {
            subcompt.push(subs.SubCompetency);
            // console.log(subs.SubCompetency)
          });
        });
      }
      // console.log(subcompt)
      res.send(subcompt);
    });
  } catch (error) {
    console.log("Some error");
  }
});

module.exports = router;
