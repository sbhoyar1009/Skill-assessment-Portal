import React, { useState, useContext, useEffect } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { StyledTableRow } from "../../../../Assets/Styles/jsStyles";
import Timer from "../../../Layouts/Timer";
import { UserContext } from "../../../../App";
import { getTestByID, TestPresent } from "../../../../Util/test";
import {
  updateDetails,
  // getAllCompetencies,
  // getSubCompetencies,
} from "../../../../Util/test";
import {
  // DatePicker,
  // TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
// import { useStyles } from "../../../../Assets/Styles/jsStyles";
// import { TextField, FormControl } from "@material-ui/core";

function createData(name, value) {
  return { name, value };
}

// function createLeaderboard(rank, username, totalScore) {
//   return { rank, username, totalScore };
// }

export default function BasicTable(props) {
  const { test, isActive } = props;
  const [newTest, setnewTest] = useState({});
  const [TestName, setTestName] = useState("");
  // const [competencies, setCompetencies] = React.useState([]);
  // const [subcompetencies, setSubcompetencies] = React.useState([]);
  // const [update, setUpdate] = useState({});
  const userData = useContext(UserContext);
  const rows = [];

  // const classes = useStyles();

  const updateForm = () => {
    // console.log(update);
    userData.setisLoading(true);
    console.log(newTest);
    updateDetails(newTest, newTest._id)
      .then((res) => {
        if (res.status === "error") {
          userData.setisLoading(false);
          userData.handleAlert("error", `res.msg`);
        } else {
          userData.setisLoading(false);
          setnewTest(res.data.updatedTest);

          // setUpdate(res.data.updatedTest);
          // console.log(res.data);
          // window.location.reload();
          userData.handleAlert("success", "Updated Test Details!");
        }
      })
      .catch((err) => {
        console.log(err);
        userData.setisLoading(false);
        userData.handleAlert("error", "Something went wrong!");
      });
  };

  // const getSubCompetency = (Competency) => {
  //   getSubCompetencies(Competency).then((res) => {
  //     setSubcompetencies(res.data);
  //     console.log(res.data);
  //     userData.setisLoading(false);
  //   });
  // };

  useEffect(() => {
    userData.setisLoading(true);
    getTestByID(test._id)
      .then((res) => {
        setnewTest(res.data);
        // getSubCompetency(test.trackName);
        setTestName(res.data.displayTitle);
        // getAllCompetencies().then((res) => {
        //   setCompetencies(res.data);
        // });
        // setUpdate(res.data);
        // console.log(res.data);
        userData.setisLoading(false);
      })
      .catch((err) => {
        console.log("error while fetching participants", err);
        userData.setisLoading(false);
      });
  }, [test._id]);

  if (newTest._id) {
    rows.push(createData("Title", newTest.displayTitle));
    rows.push(createData("Competency Name", newTest.trackName));
    rows.push(createData("SubCompetency Name", newTest.subCompetency));
    rows.push(createData("Assignments", newTest.assignments.length));
    rows.push(createData("Participants", newTest.participants.length));
    rows.push(createData("Active", newTest.isActive ? "YES" : "NO"));
    rows.push(createData("Hidden", newTest.isHidden ? "YES" : "NO"));
    // rows.push(createData("Hidden", hide ? "YES" : "NO"));
    if (isActive) {
      rows.push(
        createData(
          "Test ends in :",
          <div style={{ width: "300px" }}>
            <Timer
              startTime={newTest.startTime}
              endTime={newTest.endTime}
              isActive={isActive}
            />
          </div>
        )
      );
    }
    rows.push(
      createData(
        "",
        <button className="btn" data-toggle="modal" data-target="#exampleModal">
          Edit Details
        </button>
      )
    );
  }

  return (
    <Paper>
      <TableContainer style={{ overflowX: "scroll", width: "100%" }}>
        <Table aria-label="simple table">
          <TableBody>
            {props.type === "TestDetails"
              ? rows.map((row) => {
                  return (
                    <StyledTableRow key={row.name}>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ paddingLeft: "1rem" }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.value}</TableCell>
                    </StyledTableRow>
                  );
                })
              : ""}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for updating the Test details */}

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit details
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Test Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    defaultValue={newTest.displayTitle}
                    onChange={(e) => {
                      TestPresent(e.target.value.trim())
                        .then((res) => {
                          if (res.data.status) {
                            userData.handleAlert(
                              "error",
                              "Test name already exists"
                            );
                            e.target.value = TestName;
                          } else {
                            let temp = { ...newTest };
                            temp.displayTitle = e.target.value;
                            setnewTest(temp);
                          }
                        })
                        .catch((err) => {
                          userData.handleAlert("error", "Something went wrong");
                          e.target.value = TestName;
                        });
                    }}
                  />
                </div>

                {/* Below commented code is to be used when we have to update competency and sub-competency of the Test */}

                {/* <div className="form-group">
                  <label htmlFor="exampleInputPassword1">Competency</label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect1"
                    onChange={(e) => {
                      let temp = { ...newTest };
                      temp.trackName = e.target.value;
                      setnewTest(temp);
                      getSubCompetency(e.target.value);
                    }}
                  >
                    <option value={newTest.trackName} className="d-none">
                      {newTest.trackName}
                    </option>
                    {competencies.length > 0
                      ? competencies.map((competency) => {
                          return (
                            <option value={competency}>{competency}</option>
                          );
                        })
                      : ""}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputPassword1">Sub-Competency</label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect1"
                    onChange={(e) => {
                      let temp = { ...newTest };
                      temp.subCompetency = e.target.value;
                      setnewTest(temp);
                    }}
                  >
                    {test.trackName !== newTest.trackName ? (
                      <option value="Select Sub-Competency" className="d-none">
                        Select Sub-Competency
                      </option>
                    ) : (
                      <option value={newTest.subCompetency} className="d-none">
                        {newTest.subCompetency}
                      </option>
                    )}
                    {subcompetencies.length > 0
                      ? subcompetencies.map((subc) => {
                          return <option value={subc}>{subc}</option>;
                        })
                      : ""}
                  </select>
                </div> */}
                <div>
                  <label> Hide Test </label> <br />
                  <input
                    type="radio"
                    name="hidden"
                    onChange={() => {
                      // let temp = { ...newTest };
                      // temp.isHidden = true;
                      // // setHide(true);
                      // setnewTest(temp);
                      newTest.isHidden = true;
                    }}
                  />
                  <label for="Yes"> &nbsp; Yes</label>&nbsp; &nbsp; &nbsp;
                  &nbsp;
                  <input
                    type="radio"
                    name="hidden"
                    onChange={() => {
                      let temp = { ...newTest };
                      temp.isHidden = false;
                      // setHide(false);
                      setnewTest(temp);
                    }}
                  />
                  <label for="No"> &nbsp; No</label>
                </div>
                <div className="form-group">
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DateTimePicker
                      value={newTest.startTime}
                      // disabled={isDisabled ? true : false}
                      // id="datetime-local"
                      label="Start Date and Time"
                      // type="datetime-local"
                      defaultValue="YYYY-MM-DDT10:30"
                      required={true}
                      // className={classes.root}
                      onChange={(e) => {
                        if (
                          new Date(e._d) > new Date(newTest.startTime) &&
                          new Date(e._d) < new Date(newTest.endTime)
                        ) {
                          // settestData({...testData, "startTime": e._d});
                          // setisDisabled(false);
                          let temp = { ...newTest };
                          temp.startTime = e._d;
                          setnewTest(temp);
                        } else {
                          if (new Date(e._d) > new Date(newTest.startTime)) {
                            userData.handleAlert(
                              "error",
                              `Date and Time should be greater than current time`
                            );
                          }
                          if (new Date(e._d) < new Date(newTest.endTime)) {
                            userData.handleAlert(
                              "error",
                              `Date and Time should be greater than end time`
                            );
                          }
                        }
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>
                <div className="form-group">
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DateTimePicker
                      value={newTest.endTime}
                      // disabled={isDisabled ? true : false}
                      // id="datetime-local"
                      label="End Date and Time"
                      // type="datetime-local"
                      defaultValue="YYYY-MM-DDT10:30"
                      required={true}
                      // className={classes.root}
                      onChange={(e) => {
                        if (new Date(e._d) > new Date(newTest.endTime)) {
                          // settestData({...testData, "startTime": e._d});
                          // setisDisabled(false);
                          let temp = { ...newTest };
                          temp.endTime = e._d;
                          setnewTest(temp);
                        } else {
                          userData.handleAlert(
                            "error",
                            `Date and Time should be greater than current time`
                          );
                        }
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              {/* <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button> */}
              <button
                onClick={() => {
                  updateForm();
                  console.log(newTest.isHidden);
                }}
                type="submit"
                data-dismiss="modal"
                className="btn"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
}
