import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import "../../Assets/Styles/Login.css";
import kpit from "../../Assets/Images/ecodelogo.png";
import Alert from "@material-ui/lab/Alert";
import { UserContext } from "../../App";
import { FaGitlab } from "react-icons/fa";
import gitlabLogo from "../../Assets/Images/gitlab.png";

const Login = () => {
  const user = useContext(UserContext);
  const [alertOpen, setAlertOpen] = useState([false]);

  const getUser = async () => {
    await axios
      .get("/api/current_user")
      .then((res) => {
        // console.log("getUser:", res.data);
        if (Object.keys(res.data).length) {
          //this condition checks if user data is returned
          user.authStatus(res.data);
        } else if (res.data.length === 0) {
          //this condition is not neccessary but kept for reference
          // console.log("User not logged in");
        } else if (Object.keys(res.data).length === 0) {
          //this condition is executed when user with KPIT username is not found in DB
          // console.log("User not found in DB");
          user.authStatus(null);
          axios.get("/auth/logout");
          setAlertOpen([true, "error", `No Test Assigned`]);
          setTimeout(() => {
            setAlertOpen(false);
          }, 2000);
        }
      })
      .catch((err) => {
        user.authStatus(null);
        console.log("caught an error");
        console.error(err);
      });
  };

  useEffect(() => {
    user.setisLoading(true);
    getUser()
      .then((loggedUser) => {})
      .catch((err) => {
        console.error(err);
      });
    user.setisLoading(false);
  }, []);

  return (
    <div>
      <Router>
        <div className="container-fluid logic-page">
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-8 login-img"></div>
            <div className="col-sm-12 col-md-6 col-lg-4 login-column">
              <div className="container-fluid">
                <div className="row">
                  <div className="col">
                    <img src={kpit} alt="" className="login-ecode-logo"></img>
                  </div>
                </div>
                <div className="row login-description-portal">
                  <div>Skill Assessment Portal</div>
                </div>
                <div className="row">
                  <hr className="login-hr"></hr>
                </div>
                <div className="row">
                  <div className="col mt-4 d-flex flex-column justify-content-center">
                    <div className="mb-4">
                      {/* <FaIcons.FaUserCircle className="icon-img" /> */}
                      {/* <img
                        src={gitlabLogo}
                        alt=""
                        style={{
                          width: "4.5rem",
                        }}
                      /> */}
                    </div>
                    <div>
                      <a href="/auth/gitlab" className="btn float-shadow">
                        <FaGitlab style={{ marginRight: 8 }} /> Sign in with
                        Gitlab
                      </a>
                    </div>
                    <div className="">
                      <div style={{ margin: "20px auto", width: "45%" }}>
                        {alertOpen[0] ? (
                          <Alert severity={alertOpen[1]} variant="filled">
                            {alertOpen[2]}
                          </Alert>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
};

export default Login;
