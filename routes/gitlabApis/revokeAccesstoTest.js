const axios = require("axios");
const AddMember = require("./add_member");
const DeleteMember = require("./delete_member");
const { GetUserID } = require("./user");
const GetGroupID = require("./getGroup");

const DeletingAMember = (Name, GroupName) => {
  GetGroupID(GroupName)
    .then((res) => {
      let ID = res.data[0].id;
      GetUserID(Name)
        .then((res) => {
          let userID = res.data[0].id;
          DeleteMember(ID, userID)
            .then((res) => {
              console.log("Access Revoked");
              return true;
            })
            .catch((err) => {
              console.log("Cannot revoke Access");
              console.log(err);
              return false;
            });
        })
        .catch((err) => {
          console.log("Cannot revoke Access");
          return false;
        });
    })
    .catch((err) => {
      console.log("Group Not found", err);
      return false;
    });
};

module.exports = DeletingAMember;
