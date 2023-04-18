const axios = require("axios");
require("dotenv").config();

const GetIdByName =  (AssignmentName, MasterGroupID) => {
  return axios({
    method: "get",
    url: `${process.env.InstanceURL}/groups/${MasterGroupID}/projects?search=${AssignmentName}`,
    withCredentials: true,
    crossdomain: true,
    headers: {
      Authorization: "Bearer " + process.env.Token,
    },
  });
};

// GetIdByName("Demo-Assignment", 5304)
//   .then((res) => {
//     console.log(res.data[1].name);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
module.exports = GetIdByName;
