const axios = require("axios");
require("dotenv").config();
const GetUserID = async (Username) => {
  return await axios({
    method: "get",
    url: `${process.env.InstanceURL}/users?username=${Username}`,
    withCredentials: true,
    crossdomain: true,
    headers: { Authorization: "Bearer " + process.env.Token },
  });
};

const checkUserList = async (participants) => {
  var validUsernames = [];
  var invalidUsernames = [];

  for (let i = 0; i < participants.length; i++) {
    var response = await axios({
      method: "get",
      url: `${process.env.InstanceURL}/users?username=${participants[i]}`,
      withCredentials: true,
      crossdomain: true,
      headers: { Authorization: "Bearer " + process.env.Token },
    });
    var user = response.data[0];
    if (response.data.length > 0) {
      validUsernames.push(user.username);
    } else {
      invalidUsernames.push(participants[i]);
    }
  }
  return {
    validUsernames,
    invalidUsernames,
  };
};

// let { validUsernames, invalidUsernames } = checkUserList([
//   "tejasb3",
//   "shreyasb3",
//   "omkarw3",
//   "gauravr3",
//   "yesiam",
//   "ucan",
// ]);
// console.log(validUsernames);
// console.log(invalidUsernames);

// GetUserID("tejasb3").then((res) => {
//   console.log(res.data[0]);
// });

module.exports = { GetUserID, checkUserList };
