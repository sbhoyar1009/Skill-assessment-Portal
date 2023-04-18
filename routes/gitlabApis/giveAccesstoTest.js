const AddMember = require("./add_member");
const { GetUserID } = require("./user");
const GetGroupID = require("./getGroup");

const AddingAMember = (Name, GroupName) => {
  GetGroupID(GroupName)
    .then((res) => {
      let ID = res.data[0].id;
      console.log("GroupID", ID);
      GetUserID(Name)
        .then((res) => {
          let userID = res.data[0].id;
          console.log(userID);
          AddMember(ID, userID)
            .then((res) => {
              console.log("User added");
              return true;
            })
            .catch((err) => {
              console.log("Cannot add user", err);
              return false;
            });
        })
        .catch((err) => {
          console.log("Cannot add user", err);
          return false;
        });
    })
    .catch((err) => {
      console.log("Group Not found", err);
      return false;
    });
};

module.exports = AddingAMember;
