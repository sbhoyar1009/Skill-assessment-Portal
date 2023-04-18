require("dotenv").config();
const axios = require("axios").default;
const Token = process.env.GITLAB_REGISTRATION_TOKEN;
const authToken = process.env.AUTH_TOKEN;
const express = require("express");
const router = express.Router();
const GitlabUser = require("../../models/GitlabUser");
const NewGitlabUser = require("../../models/NewGitlabUser");
const SkillTestUser = require("../../models/SkillTestUser");
const NAB1_user = require("../../models/NAB1_user");
const Prefix = require("../../models/Prefix");

const User = require("../../models/User");

const getSuffixNumber = (username) => {
  let suffix = "";
  for (let i = username.length - 1; i >= 0; i--) {
    if (!isNaN(parseInt(username[i]))) {
      suffix = username[i] + suffix;
    } else {
      return parseInt(suffix);
    }
  }
};
router.post("/gitlab/register/:prefix", async (req, res) => {
  //First check the token
  if (req.headers.authorization !== "Bearer " + authToken) {
    res.status(401).send({ Message: "Unauthorized access" });
  } else {
    const prefix = req.params.prefix.trim();
    const user = req.body;

    const newUser = new NewGitlabUser({
      name: user.name,
      email: user.email.toLowerCase(),
    });

    const existingUser = await NewGitlabUser.findOne({
      email: user.email.toLowerCase(),
    });

    // If user is already registered, send details from database
    if (existingUser) {
      res.send(existingUser);
    } else {
      let givenFirstName = user.name.split(" ")[0].toLowerCase();
      let arrlen = user.name.split(" ").length;
      let givenLastName = user.name.split(" ")[arrlen - 1].toLowerCase();

      // Check for other users with same firstname
      const existingName = await NewGitlabUser.find({
        name: { $regex: givenFirstName, $options: "i" },
      }).sort({ _id: -1 });

      // let firstname = existingName.name.split(" ")[0];

      // Get the max suffix that was used recently in username
      let maxSuffix = 1;
      for (let i = 0; i < existingName.length; i++) {
        if (getSuffixNumber(existingName[i].username) > maxSuffix) {
          maxSuffix = getSuffixNumber(existingName[i].username);
        }
      }

      // If there exists a user with same name, increment suffix or else use "1"
      if (existingName.length > 0) {
        newUser.username =
          prefix + givenFirstName + givenLastName[0] + String(maxSuffix + 1);
      } else {
        newUser.username =
          prefix + givenFirstName + givenLastName[0] + String(maxSuffix);
      }

      let data = newUser;
      // console.log("data : ", data);
      // Below is the actual api to register a user on gitlab
      axios({
        method: "post",
        url: "https://ecode-gitlab.kpit.com/api/v4/users",
        withCredentials: true,
        crossdomain: true,
        headers: { Authorization: "Bearer " + Token },
        data: {
          email: data.email.toLowerCase(),
          username: data.username,
          reset_password: "true",
          name: data.name,
        },
      })
        .then((response) => {
          let { id, avatar_url, created_at } = response.data;
          // console.log("response : ", response.data);

          newUser.gitlabID = id;
          newUser.avatar = avatar_url;
          newUser.created_at = created_at;
          newUser.prefix = prefix;

          newUser
            .save()
            .then((response) => {
              res.send(response);
            })
            .catch((err) => {
              // Error while saving user to database
              res.status(409).send({ msg: "Username already exists" });
            });
        }) // Below code executes when a user is registered but not present in database
        .catch(async (err) => {
          axios({
            method: "get",
            url: `https://ecode-gitlab.kpit.com/api/v4/users?search=${data.email}`,
            withCredentials: true,
            crossdomain: true,
            headers: { Authorization: "Bearer " + Token },
          })
            .then((response) => {
              let { id, username, avatar_url, created_at } = response.data[0];
              let user = {
                username,
                created_at,
                avatar: avatar_url,
                gitlabID: id,
                name: data.name,
                email: data.email,
                prefix: prefix,
              };

              let newUser = new NewGitlabUser(user);

              newUser
                .save()
                .then((user) => {
                  res.send(user);
                })
                .catch((err) => {
                  res.send(err);
                });
            })
            .catch((err) => {
              res.send(err);
            });
        });
    }
  }
});

router.get("/checkUser",async(req,res)=>{
  console.log("Hitted")
  let arr = ["dharekarabhijeet@gmail.com",
  "vishaldongre550@gmail.com",
  "kammaryashwant@gmail.com",
  "babughorpade123@gmail.com",
  "thallapanenimounika@gmail.com",
  "hrudaysaiakula@gmail.com",
  "sriharshasannidhiraju@gmail.com",
  "geethikareddya6@gmail.com",
  "prtkmali987@gmail.com",
  "Kushalgowda1924@gmail.com ",
  "kattamurimounika801@gmail.com",
  "Saqibseikh7688@gmail.com",
  "erikalareddynagaraja@gmail.com",
  "vinayak.bhor99@gmail.com",
  "mayankarote1832000@gmail.com",
  "ankush.varute705@gmail.com",
  "dhanshripande1999@gmail.com",
  "suchandar06@gmail.com",
  "Dubeyshivam264@gmail.com",
  "swapnilkurule1205@gmail.com",
  "punnisa786@gmail.com",
  "kk.thanoj@gmail.com",
  "shindejayashree1610@gmail.com",
  "gautami200011@gmail.com",
 
  "rashmigowdasanr@gmail.com",
  "thallapanenimounika@gmail.com",
  "maheshgaikwad9011@gmail.com",
  "prathima.pathipati@gmail.com",
  "bhavankumar8095@gmail.com",
  "sujathafresher21@gmail.com",
  "nikugorde1611@gmail.com",
  "anilkumarakkupalli2000@gmail.com",
  "pattanshettiarpita123@gmail.com",
  "Adithyachowdary777@gmail.com",
  "surajchavan008@gmail.com",
  "kudalevineet@gmail.com",
  "shindepriyanka0599@gmail.com",
  "rajeshmangena220@gmail.com ",
  "sirikokku527@gmail.com",
  "modiumchavvapravallika@gmail.com",
  "prathima.pathipati@gmail.com",
  "mayurilokhande339@gmail.com",
  "shindejayashree1610@gmail.com",
  "vbsvijay0@gmail.com",
  "swapnilgondkar98@gmail.com",
  "shelaranuradha1998@gmail.com",
  "rajakumarhinchageri12@gmail.com",
  "sharmaaman041@gmail.com",
  "pragatichauhan890@gmail.com",
  "kalyankumar1500@gmail.com",
  "khakalkanchan@gmail.com",
  "pasupuletisrihari123@gmail.com",
  "mandapeshubham10@gmail.com",
  "mallelavinuthna@gmail.com",
  "sirikokku527@gmail.com",
  "vaibhavpatil61.vp@gmail.com",
  "khakalkanchan@gmail.com",
  "mayankarote1832000@gmail.com",
  "nishigandhavpatil1998@gmail.com",
  "okulkarni35@gmail.com",
  "shwethdasar@gmail.com",
  "thoratas19999@gmail.com",
  "garrekowshik@gmail.com",
  "thoratas19990@gmail.com",
  "deepukumar36@rediffmail.com",
  "avulaveena2000@gmail.com",
  "prathima.pathipati@gmail.com",
  "Pavaniallena123@gmal.com",
  "atulkagane123@gmail.com",
  "omkardpawar42@gmail.com"
  ]
  arr.forEach(element => { 
  axios({
    method: "get",
    url: `https://ecode-gitlab.kpit.com/api/v4/users?search=${element}`,
    withCredentials: true,
    crossdomain: true,
    headers: { Authorization: "Bearer " + Token },
  }).then((res)=>{
    if(res.data[0]){
       
    console.log(element,",",res.data[0].state)}else{
      console.log(element,",undefined")
    }
  })
});
})

router.post("/gitlab/batch-register/:prefix", async (req, res) => {
  let registeredUsers = [];
  let unregisteredUsers = [];
  //let users = req.body.users;
  let users = req.body;
  let prefix = req.params.prefix.trim();
  // let prefix="";
  if (req.headers.authorization !== "Bearer " + authToken) {
    res.status(401).send({ Message: "Unauthorized access" });
  } else {
    let prefixExists = await Prefix.findOne({ prefix: prefix });
    if (!prefixExists) {
      let newPrefix = new Prefix({ prefix: prefix });
      newPrefix.save();
    }

    for (let i = 0; i < users.length; i++) {
      try {
        let newUser = await axios({
          method: "post",
          url: `http://localhost:9000/gitlab/register/${prefix}`,
          withCredentials: true,
          crossdomain: true,
          headers: { Authorization: req.headers.authorization },
          data: { name: users[i].name, email: users[i].email.toLowerCase() },
        });
        console.log("user:", newUser.data);
        registeredUsers.push(newUser.data);
      } catch (error) {
        console.log("error:", error);
        unregisteredUsers.push(users[i]);
      }
    }
    console.log("Users Count : ", registeredUsers.length);
    res.send(registeredUsers);
  }
});

router.post("/gitlab/delete-accounts", async (req, res) => {
  let users = req.body.users;
  let deleted_Accounts = [];
  if (req.headers.authorization !== "Bearer " + authToken) {
    res.status(401).send({ Message: "Unauthorized access" });
  } else {
    for (let i = 0; i < users.length; i++) {
      try {
        let deletedUser = await axios({
          method: "delete",
          url: `https://ecode-gitlab.kpit.com/api/v4/users/${users[i].id}`,
          withCredentials: true,
          crossdomain: true,
          headers: { Authorization: "Bearer " + Token },
        });

        if (deletedUser.statusCode === 204) {
          NewGitlabUser.deleteOne({ gitlabID: users[i].id }, (err, deleted) => {
            if (err) {
              console.log("error in removing user from database : ", err);
            } else {
              deleted_Accounts.push(users[i]);
            }
          });
          // console.log(users[i]);
        } else {
          NewGitlabUser.deleteOne({ gitlabID: users[i].id }, (err, deleted) => {
            if (err) {
              console.log("error in removing user from database : ", err);
            } else {
              deleted_Accounts.push(users[i]);
            }
          });
          // console.log(users[i]);
        }
      } catch {
        let temp_user = await NAB1_user.findOne({
          gitlabID: users[i].id,
        });
        if (temp_user) {
          NewGitlabUser.deleteOne({ gitlabID: users[i].id }, (err, deleted) => {
            if (err) {
              console.log("error in removing user from database : ", err);
            } else {
              deleted_Accounts.push(users[i]);
            }
          });
          // console.log(users[i]);
        }
      }
    }
  }

  res.send(deleted_Accounts);
});

// [
//     {
//         "_id": "61c073e6c6fb710d90f09b6a",
//         "username": "nab1_yuvathir1",
//         "created_at": "2021-12-13T06:18:48.085Z",
//         "avatar": "https://secure.gravatar.com/avatar/c063ef613e67e824b22e84b607104a2e?s=80&d=identicon",
//         "gitlabID": 6494,
//         "name": "Yuvathi R",
//         "email": "yuviyuva471@gmail.com",
//         "__v": 0
//     },
//   ]

router.get("/gitlab/check-accounts", async (req, res) => {
  let users = req.body.users;
  let activeUsers = [];
  let inactiveUsers = [];
  let unregisteredUsers = [];
  if (req.headers.authorization !== "Bearer " + authToken) {
    res.status(401).send({ Message: "Unauthorized access" });
  } else {
    for (let i = 0; i < users.length; i++) {
      // let newUser = 
      await axios({
        method: "get",
        url: `https://ecode-gitlab.kpit.com/api/v4/users?search=${users[i]}`,
        withCredentials: true,
        crossdomain: true,
        headers: { Authorization: "Bearer " + Token },
      }).then((res)=>{
        let newUser = res;
      

      if (newUser.data.length > 0) {
        if (
          newUser.data[0].state === "active" &&
          newUser.data[0].last_sign_in_at &&
          newUser.data[0].confirmed_at &&
          newUser.data[0].last_activity_on
        ) {
          activeUsers.push(newUser.data[0].username);
        } else {
          inactiveUsers.push(newUser.data[0]);
        }
      } else {
        unregisteredUsers.push(users[i]);
      }
    })
    }
    // res.send({ activeUsers, inactiveUsers, unregisteredUsers });
    res.send({ activeUsers});
  }
});

router.post("/gitlab/add-accounts-using-json-db/:prefix", async (req, res) => {
  let users = req.body.users;
  let registeredUsers = [];
  let unregisteredUsers = [];
  let alreadyAddedUsers = [];
  let prefix = req.params.prefix.trim();

  if (req.headers.authorization !== "Bearer " + authToken) {
    res.status(401).send({ Message: "Unauthorized access" });
  } else {
    for (let i = 0; i < users.length; i++) {
      let alreadyAdded = await NewGitlabUser.findOne({
        email: users[i].email.toLowerCase(),
      });

      if (!alreadyAdded) {
        try {
          let user = users[i];
          user.prefix = prefix;
          let newUser = await NewGitlabUser(user);
          newUser.save();
          registeredUsers.push(newUser);
        } catch (error) {
          console.log("error:", error);
          unregisteredUsers.push(users[i]);
        }
      } else {
        alreadyAddedUsers.push(users[i]);
      }
    }
    console.log("Users Count : ", registeredUsers.length);
    res.send(registeredUsers, unregisteredUsers, alreadyAddedUsers);
  }
});

module.exports = router;

router.post("/gitlab/activate-account", async (req, res) => {
  let users = req.body.users;
  // console.log(users);
  let activeUsers = [];
  let inactiveUsers = [];
  let unregisteredUsers = [];
  // if (req.headers.authorization !== "Bearer " + authToken) {
  //   res.status(401).send({ Message: "Unauthorized access" });
  // } else {
    for (let i = 0; i < users.length; i++) {
      let newUser = await axios({
        method: "post",
        url: `https://ecode-gitlab.kpit.com/api/v4/users/${users[i]}/activate`,
        withCredentials: true,
        crossdomain: true,
        headers: { Authorization: "Bearer " + process.env.GITLAB_REGISTRATION_TOKEN },
      });
    }
      // if (newUser.data.length > 0) {
      //   if (
      //     newUser.data[0].state === "active" &&
      //     newUser.data[0].last_sign_in_at &&
      //     newUser.data[0].confirmed_at &&
      //     newUser.data[0].last_activity_on
      //   ) {
      //     activeUsers.push(newUser.data[0]);
      //   } else {
      //     inactiveUsers.push(newUser.data[0]);
      //   }
      // } else {
      //   unregisteredUsers.push(users[i]);
      // }
    
    // }
    
    // res.send({ activeUsers, inactiveUsers, unregisteredUsers });
    res.send(201);
  // }
});

// router.post("/novaedu/register", async (req, res) => {
//   //First check the token
//   if (req.headers.authorization !== "Bearer " + authToken) {
//     res.status(401).send({ Message: "Unauthorized access" });
//   } else {
//     const user = req.body;

//     const newUser = new NAB1_user({ name: user.name, email: user.email });

//     const existingUser = await NAB1_user.findOne({ email: user.email });

//     // If user is already registered, send details from database
//     if (existingUser) {
//       res.send(existingUser);
//     } else {
//       let givenFirstName = user.name.split(" ")[0].toLowerCase();
//       let arrlen = user.name.split(" ").length;
//       let givenLastName = user.name.split(" ")[arrlen - 1].toLowerCase();

//       // Check for other users with same firstname
//       const existingName = await NAB1_user.find({
//         name: { $regex: givenFirstName, $options: "i" },
//       }).sort({ _id: -1 });

//       // let firstname = existingName.name.split(" ")[0];

//       // Get the max suffix that was used recently in username
//       let maxSuffix = 1;
//       for (let i = 0; i < existingName.length; i++) {
//         if (getSuffixNumber(existingName[i].username) > maxSuffix) {
//           maxSuffix = getSuffixNumber(existingName[i].username);
//         }
//       }

//       // If there exists a user with same name, increment suffix or else use "1"
//       if (existingName.length > 0) {
//         newUser.username =
//           "nab1_" + givenFirstName + givenLastName[0] + String(maxSuffix + 1);
//       } else {
//         newUser.username =
//           "nab1_" + givenFirstName + givenLastName[0] + String(maxSuffix);
//       }

//       let data = newUser;
//       // Below is the actual api to register a user on gitlab
//       axios({
//         method: "post",
//         url: "https://ecode-gitlab.kpit.com/api/v4/users",
//         withCredentials: true,
//         crossdomain: true,
//         headers: { Authorization: "Bearer " + Token },
//         data: {
//           email: data.email,
//           username: data.username,
//           reset_password: "true",
//           name: data.name,
//         },
//       }) //If user is successfully registered, add user to database and return response
//         .then((response) => {
//           let { id, avatar_url, created_at } = response.data;

//           newUser.gitlabID = id;
//           newUser.avatar = avatar_url;
//           newUser.created_at = created_at;

//           newUser
//             .save()
//             .then((response) => {
//               res.send(response);
//             })
//             .catch((err) => {
//               // Error while saving user to database
//               res.status(409).send({ msg: "Username already exists" });
//             });
//         }) // Below code executes when a user is registered but not present in database
//         .catch(async (err) => {
//           axios({
//             method: "get",
//             url: `https://ecode-gitlab.kpit.com/api/v4/users?search=${data.email}`,
//             withCredentials: true,
//             crossdomain: true,
//             headers: { Authorization: "Bearer " + Token },
//           })
//             .then((response) => {
//               let { id, username, avatar_url, created_at } = response.data[0];
//               let user = {
//                 username,
//                 created_at,
//                 avatar: avatar_url,
//                 gitlabID: id,
//                 name: data.name,
//                 email: data.email,
//               };

//               let newUser = new NAB1_user(user);

//               newUser
//                 .save()
//                 .then((user) => {
//                   res.send(user);
//                 })
//                 .catch((err) => {
//                   res.send(err);
//                 });
//             })
//             .catch((err) => {
//               res.send(err);
//             });
//         });
//     }
//   }
// });

// router.post("/findmissing", async (req, res) => {
//   let count = 0;
//   let miss = 0;
//   for (let i = 0; i < novaeduusers.length; i++) {
//     let user = await NAB1_user.findOne({
//       email: novaeduusers[i].email,
//     });

//     if (user) {
//       count++;
//       console.log("Count:", count);
//     } else {
//       miss++;
//       novamissing.push(novaeduusers[i]);
//       console.log("Miss:", miss);
//     }
//   }
//   res.send(novamissing);
// });

// router.post("/gitlab/register", async (req, res) => {
//   //First check the token
//   if (req.headers.authorization !== "Bearer " + authToken) {
//     res.status(401).send({ Message: "Unauthorized access" });
//   } else {
//     const user = req.body;
//     const newUser = new GitlabUser(user);
//     const existingUser = await GitlabUser.findOne({ email: user.email });

//     if (existingUser) {
//       res.send(existingUser);
//     } else {
//       let givenFirstName = user.firstname.toLowerCase();

//       const existingName = await GitlabUser.find({
//         firstname: { $regex: givenFirstName, $options: "i" },
//       }).sort({ _id: -1 });

//       let firstname = newUser.firstname;
//       let lastname = newUser.lastname;

//       if (existingName.length > 0) {
//         newUser.username =
//           "nova_" +
//           firstname.split(" ")[0].toLowerCase() +
//           lastname[0].toLowerCase() +
//           String(getSuffixNumber(existingName[0].username) + 1);
//       } else {
//         newUser.username =
//           "nova_" +
//           firstname.split(" ")[0].toLowerCase() +
//           lastname[0].toLowerCase() +
//           "1";
//       }
//       let data = newUser;
//       axios({
//         method: "post",
//         url: "https://ecode-gitlab.kpit.com/api/v4/users",
//         withCredentials: true,
//         crossdomain: true,
//         headers: { Authorization: "Bearer " + Token },
//         data: {
//           email: data.email,
//           username: data.username,
//           reset_password: "true",
//           name: data.firstname + " " + data.lastname,
//         },
//       })
//         .then((response) => {
//           let { id, avatar_url, created_at } = response.data;

//           newUser.gitlabID = id;
//           newUser.avatar = avatar_url;
//           newUser.created_at = created_at;

//           newUser
//             .save()
//             .then((response) => {
//               res.send(response);
//             })
//             .catch((err) => {
//               res.status(409).send({});
//             });
//         })
//         .catch(async (err) => {
//           axios({
//             method: "get",
//             url: `https://ecode-gitlab.kpit.com/api/v4/users?search=${data.email}`,
//             withCredentials: true,
//             crossdomain: true,
//             headers: { Authorization: "Bearer " + Token },
//           })
//             .then((response) => {
//               let { id, username, avatar_url, created_at } = response.data[0];
//               let user = {
//                 username,
//                 created_at,
//                 avatar: avatar_url,
//                 userID: data.userID,
//                 gitlabID: id,
//                 firstname: data.firstname,
//                 lastname: data.lastname,
//                 email: data.email,
//               };

//               let newUser = new GitlabUser(user);

//               newUser
//                 .save()
//                 .then((user) => {
//                   res.send(user);
//                 })
//                 .catch((err) => {
//                   res.send(err);
//                 });
//             })
//             .catch((err) => {
//               res.send(err);
//             });
//         });
//     }
//   }
// });

// router.post("/gitlab/batch-register", async (req, res) => {
//   let registeredUsers = [];
//   let users = unregistered;

//   for (let i = 0; i < users.length; i++) {
//     let newUser = await axios({
//       method: "post",
//       url: `http://localhost:9000/gitlab/register`,
//       withCredentials: true,
//       crossdomain: true,
//       headers: { Authorization: "Bearer " + "RLzMpbXptTx_CxAyWdM" },
//       data: users[i],
//     });
//     console.log("user:", newUser.data);
//     registeredUsers.push(newUser.data);
//   }
//   console.log(registeredUsers.length);
//   res.send(registeredUsers);
// });

// router.get("/users/unsigned", async (req, res) => {
//   let unsigned = [];
//   let signed = [];
//   let count = 0;
//   for (let i = 0; i < unregistered.length; i++) {
//     let data = await axios({
//       method: "get",
//       url: `https://ecode-gitlab.kpit.com/api/v4/users?search=${unregistered[i].username}`,
//       withCredentials: true,
//       crossdomain: true,
//       headers: { Authorization: "Bearer " + Token },
//     });

//     if (data && data.data && data.data[0].last_sign_in_at === null) {
//       count++;
//       console.log(count);
//       unsigned.push({
//         email: data.data[0].email,
//         username: data.data[0].username,
//         name: data.data[0].name,
//       });
//       console.log("now:", unregistered[i].username);
//     } else {
//       signed.push(data.data[0].username);
//       console.log("All IS WELL");
//     }
//     // .then((data) => {
//     //   // console.log(data.data[0].last_sign_in_at);
//     //   if (data.data[0].last_sign_in_at === null) {
//     //     count++;
//     //     console.log(count);
//     //     unsigned.push(data.data[0]);
//     //     console.log("now:", tempuser[i].username);
//     //   }
//     // })
//     // .catch((err) => {
//     //   console.log("error for:", err);
//     //   // console.log("ERROR:", err);
//     //   // res.send(err);
//     // });
//   }
//   console.log(unsigned.length);
//   res.send(signed);
// });

// router.post("/skilltest/gitlab/register", async (req, res) => {
//   const user = req.body;
//   const newUser = new SkillTestUser(user);
//   const existingUser = await SkillTestUser.findOne({ email: user.email });

//   // If user is already registered, send details from database
//   if (existingUser) {
//     res.send(existingUser);
//   } else {
//     axios({
//       method: "post",
//       url: "https://ecode-gitlab.kpit.com/api/v4/users",
//       withCredentials: true,
//       crossdomain: true,
//       headers: { Authorization: "Bearer " + Token },
//       data: {
//         email: user.email,
//         username: user.username,
//         reset_password: "true",
//         name: user.name,
//       },
//     }) //If user is successfully registered, add user to database and return response
//       .then((response) => {
//         console.log("first then:", response.data);
//         let { id, avatar_url, created_at } = response.data;

//         newUser.gitlabID = id;
//         newUser.avatar = avatar_url;
//         newUser.created_at = created_at;

//         newUser
//           .save()
//           .then((response) => {
//             res.send(response);
//           })
//           .catch((err) => {
//             // Error while saving user to database
//             res.status(409).send({ msg: "Username already exists" });
//           });
//       }) // Below code executes when a user is registered but not present in database
//       .catch(async (err) => {
//         console.log("first catch:", err);
//         axios({
//           method: "get",
//           url: `https://ecode-gitlab.kpit.com/api/v4/users?search=${user.email}`,
//           withCredentials: true,
//           crossdomain: true,
//           headers: { Authorization: "Bearer " + Token },
//         })
//           .then((response) => {
//             let { id, username, avatar_url, created_at } = response.data[0];
//             let user_new = {
//               username,
//               created_at,
//               avatar: avatar_url,
//               empID: user.empID,
//               gitlabID: id,
//               name: user.name,
//               email: user.email,
//             };

//             let newUser = new SkillTestUser(user_new);

//             newUser
//               .save()
//               .then((user) => {
//                 res.send(user);
//               })
//               .catch((err) => {
//                 res.send(err);
//               });
//           })
//           .catch((err) => {
//             res.send(err);
//           });
//       });
//   }
// });
