const axios = require("axios");
require("dotenv").config();

const DeleteGroup = async (GroupID) => {
  return await axios({
    method: "delete",
    url: `${process.env.InstanceURL}/groups/${GroupID}`,
    withCredentials: true,
    crossdomain: true,
    headers: { Authorization: "Bearer " + process.env.Token },
  });
};

module.exports = DeleteGroup;
