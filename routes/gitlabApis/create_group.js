const axios = require("axios");
require("dotenv").config();
 
const CreateGroup =  (GroupName) => {
   return axios({
    method: "post",
    url: `https://ecode-gitlab.kpit.com/api/v4/groups`,
    withCredentials: true,
    crossdomain: true,
    headers: { Authorization: "Bearer " + process.env.Token },
    data: {
      name: GroupName,
      path: GroupName,
      parent_id:process.env.USERGROUPS
    },
  })
};
 
module.exports = CreateGroup;