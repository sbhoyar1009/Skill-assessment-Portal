const axios = require("axios");
const Token = "Q3NgYkETTYTx_CxAyWdM";

const getUserEmail = (gitlabUsername) => {
return axios({
    method: "get",
    url: `https://ecode-gitlab.kpit.com/api/v4/users?username=${gitlabUsername}`,
    withCredentials: true,
    crossdomain: true,
    headers: { Authorization: "Bearer " + Token },
    
})
}

// getUserEmail("shreyasb3")
// .then((res)=>{
//     console.log(res.data[0].email)
//     console.log(res.data[0].state)
    
// }).catch((err)=>{
//     console.log("Error")
// })

module.exports = getUserEmail ;