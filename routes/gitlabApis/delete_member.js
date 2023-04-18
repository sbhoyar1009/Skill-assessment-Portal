const axios = require("axios");
const GetUserID = require("./user");
require("dotenv").config();

/**
 * Delete a member from a group
 * @param GroupID - The ID of the group you want to delete a member from.
 * @param user_id - The user ID of the member you want to remove.
 * @returns The response is a JSON object that contains the group's ID, name, and the user's ID.
 */
const DeleteMember = async (GroupID, user_id) => {
  return await axios({
    method: "delete",
    url: `${process.env.InstanceURL}/groups/${GroupID}/members/${user_id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { Authorization: "Bearer " + process.env.Token },
  });
};

// DeleteMember(5478, 770)
//   .then((res) => console.log(res.data))
//   .catch((err) => console.log(err));
module.exports = DeleteMember;
