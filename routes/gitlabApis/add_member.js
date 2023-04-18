const axios = require("axios");
const GetUserID = require("./user");
require("dotenv").config();

/**
 * Add a user to a group
 * @param GroupID - The ID of the group you want to add a member to.
 * @param user_id - The user ID of the user you want to add to the group.
 * @returns The response is an object with the following keys:
 */
const AddMember = async (GroupID, user_id) => {
  return await axios({
    method: "post",
    url: `${process.env.InstanceURL}/groups/${GroupID}/members?user_id=${user_id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { Authorization: "Bearer " + process.env.Token },
    data: {
      user_id: user_id,
      access_level: 30,
    },
  });
};

// AddMember(5478, 770)
//   .then((res) => console.log(res.data))
//   .catch((err) => console.log(err));

module.exports = AddMember;
