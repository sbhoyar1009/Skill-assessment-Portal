const axios = require("axios");
require("dotenv").config();

/**
 * This function will get the subgroups of the MASTERASSIGNMENTGROUPID
 * @param GroupName - The name of the group you want to create.
 * @returns The response is an array of objects. Each object contains the ID, Name, and Description of
 * a subgroup.
 */
const getsubGroup = (GroupName) => {
  return axios({
    method: "get",
    url: `${process.env.InstanceURL}/groups/${process.env.MASTERASSIGNMENTGROUPID}/subgroups?search=${GroupName}`,
    withCredentials: true,
    crossdomain: true,
    headers: { Authorization: "Bearer " + process.env.Token },
  });
};

/**
 * It gets all the subgroups of the master assignment group.
 * @returns The response is an array of objects. Each object represents a subgroup.
 */
const getsubGroupsOfGitlab = () => {
  return axios({
    method: "get",
    url: `${process.env.InstanceURL}/groups/${process.env.MASTERASSIGNMENTGROUPID}/subgroups?pagination=keyset&per_page=100&order_by=id&sort=desc`,
    withCredentials: true,
    crossdomain: true,
    headers: { Authorization: "Bearer " + process.env.Token },
  });
};

// getsubGroup("AssignmentNow")
//   .then((res) => {
//     console.log(res.data[0].id);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
module.exports = { getsubGroup, getsubGroupsOfGitlab };
