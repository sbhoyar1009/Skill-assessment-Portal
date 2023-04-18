const axios = require("axios");
require("dotenv").config();

const DeleteGroup = async (username) => {
  axios({
    method: "get",
    url: `https://ecode-gitlab.kpit.com/api/v4/groups?search=skilltestc-pt2111b03-01-${username}`,
    withCredentials: true,
    crossdomain: true,
    headers: { Authorization: "Bearer " + "Q3NgYkETTYTx_CxAyWdM" },
  })
    .then((data) => {
      let count = 0;
      for (let i = 0; i < data.data.length; i++) {
        console.log(data.data[i].id);
        axios({
          method: "delete",
          url: `https://ecode-gitlab.kpit.com/api/v4/groups/${data.data[i].id}`,
          withCredentials: true,
          crossdomain: true,
          headers: { Authorization: "Bearer " + "Q3NgYkETTYTx_CxAyWdM" },
        }).then((d) => {
          count = count + 1;
        });
      }
      console.log(count);
    })
    .catch((Err) => {
      console.log(Err);
    });

  // return await axios({
  //   method: "delete",
  //   url: `https://ecode-gitlab.kpit.com/api/v4/groups/${GroupID}`,
  //   withCredentials: true,
  //   crossdomain: true,
  //   headers: { Authorization: "Bearer " + "TsbCszpNA7KDyWqhzHFj" },
  // });
};
// let arr = [5977, 5980, 5978, 5979];

// arr.forEach((element) => {
//   DeleteGroup(element);
// });

// let NoList = [5977, 5980, 5978, 5979];

// const print = (data, callback) => {
//   console.log(data);
//   callback(null, data);
// };

// async.map(NoList, print, function (err, results) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(results);
//   }
// });
module.exports = DeleteGroup;
