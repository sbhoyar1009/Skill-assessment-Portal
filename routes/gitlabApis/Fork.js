const axios = require("axios");
const Result = require("../../models/Result");
const GetGroupID = require("./getGroup");
const GetIdByName = require("./search_name");
require("dotenv").config();

// Function to create a fork for all the projects except the first one
const ForkFromMaster = async (childGroupID, assignment) => {
  let projectID = assignment.gitlabUserProjectId;

  return await axios({
    method: "post",
    url: `${process.env.InstanceURL}/projects/${projectID}/fork?namespace_id=${childGroupID}`,
    withCredentials: true,
    crossdomain: true,
    headers: { Authorization: "Bearer " + process.env.Token },
  });
};

module.exports = ForkFromMaster;
