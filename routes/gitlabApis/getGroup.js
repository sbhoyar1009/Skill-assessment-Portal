const axios = require("axios");
require("dotenv").config();

const GetGroupID = (GroupName) => {
  return axios({
    method: "get",
    url: `${process.env.InstanceURL}/groups?search=${GroupName}`,
    withCredentials: true,
    crossdomain: true,
    headers: { Authorization: "Bearer " + process.env.Token },
  });
};

// GetGroupID("Assignment 8")
//   .then((res) => {
//     console.log(res.data[0].id);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
module.exports = GetGroupID;
