import React, { useState, createContext, useContext, useEffect } from "react";
import { ExcelRenderer } from "react-excel-renderer";
// import Datetime from 'react-datetime';
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { defaultMaterialTheme } from "../../../Assets/Styles/jsStyles";
import MomentUtils from "@date-io/moment";
import {
  Container,
  Grid,
  Box,
  Paper,
  TextField,
  FormControl,
  Select,
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { UserContext } from "../../../App";
import { useStyles } from "../../../Assets/Styles/jsStyles";
import {
  TestPresent,
  getAllCompetencies,
  getSubCompetencies,
  getCourse,
} from "../../../Util/test";
import { checkSpecialChars } from "../../../Util/regex";
import AssignmentSelect from "./AssignmentSelect";

export const TestDataFunctions = createContext(null);

function AddTest() {
  const user = useContext(UserContext);
  const [testSelected, settestSelected] = useState(false);
  const [titleLength, settitleLength] = React.useState(0);
  const [competencies, setCompetencies] = React.useState([]);
  const [subcompetencies, setSubcompetencies] = React.useState([]);
  const [course, setCourse] = React.useState([]);
  // const [selectedDate, handleDateChange] = useState(new Date());
  const [testData, settestData] = useState({
    title: "",
    displayTitle: "",
    trackName: "",
    subCompetencyCode: "",
    competencyCode: "",
    subCompetency: "",
    assignments: [],
    participants: [],
    course: "",
    courseID: "",
    // emailID:[],
    startTime: null,
    endTime: null,
    createdAt: null,
  });
  const classes = useStyles();

  useEffect(() => {
    getAllCompetencies().then((res) => {
      setCompetencies(res.data);
    });
    // getCourse().then((res) => {
    //   // console.log(res);
    //   let arr = [];
    //   res.data.courses.results.map((result) => {
    //     arr.push({
    //       name: result.name,
    //       number: result.number,
    //       ID: result.course_id,
    //     });
    //   });
    //   setCourse(arr);
    // });
  }, []);

  function onParticipantsChange(p) {
    let newObj = { ...testData };
    let participants = [...new Set([...p])];
    newObj.participants = participants;
    // let emailID = [...new Set([...e])];
    // newObj.emailID = emailID;
    settestData(newObj);
  }

  const fileHandler = (event) => {
    const filename = event.target.files[0].name;
    const fileExtension = filename.split(".").pop();
    if (fileExtension === "xlsx") {
      let fileObj = event.target.files[0];
      if (fileObj.size / 1024 < 100) {
        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, (err, resp) => {
          if (err) {
            console.log(err);
          } else {
            const usernames = [];
            // const emails = [];
            if (resp.cols.length !== 1) {
              // console.log("Invalid EXCEL");
              user.handleAlert("error", "Invalid EXCEL");
              event.target.value = null;
            } else {
              resp.rows.map((row, index) => {
                if (index !== 0 && row[0] !== undefined && row[0] !== null) {
                  usernames.push(row[0]);
                  // emails.push(row[1]);
                }
              });
              // console.log(resp.cols.length);
              onParticipantsChange(usernames);
            }
          }
        });
      } else {
        event.target.value = null;
        user.handleAlert("error", "File size exceeded");
      }
    } else {
      event.target.value = null;
      user.handleAlert("error", "Please upload Excel file.");
    }
  };

  const getSubCompetency = (Competency) => {
    getSubCompetencies(Competency).then((res) => {
      setSubcompetencies(res.data);
      user.setisLoading(false);
    });
  };
  const handleFormSubmit = (e) => {
    user.setisLoading(true);

    if (checkSpecialChars(testData.title.trim())) {
      TestPresent(testData.title.trim())
        .then((res) => {
          if (res.data.status) {
            user.setisLoading(false);
            settestSelected(false);
            user.handleAlert("error", "Test name already exists");
          } else {
            user.setisLoading(false);
            if (testData.title.length >= 5 && testData.title.length <= 40) {
              if (testData.participants.length > 0) {
                if (!validateDate()) {
                  user.handleAlert(
                    "error",
                    `Start Date should be lesser than End Date!`
                  );
                } else {
                  settestSelected(!testSelected);
                }
              } else {
                user.handleAlert(
                  "error",
                  `Test should have atleast one participant `
                );
              }
            } else {
              user.handleAlert(
                "error",
                `Test name should contain atleast 5 and maximum 40 characters `
              );
            }
          }
        })
        .catch((err) => {
          user.setisLoading(false);
          settestSelected(false);
          user.handleAlert("error", `Something went wrong`);
        });
    } else {
      user.setisLoading(false);
      settestSelected(false);
      user.handleAlert(
        "error",
        `Special characters are not allowed in test name`
      );
    }
  };

  const validateDate = () => {
    if (new Date(testData.startTime) < new Date(testData.endTime)) {
      return true;
    } else {
      return false;
    }
  };

  const [isDisabled, setisDisabled] = useState(true);

  const TestFunctions = {
    testData,
    settestSelected,
    settestData,
    settitleLength,
  };

  return (
    <TestDataFunctions.Provider value={TestFunctions}>
      <Grid className="add-test" id="add-test">
        <h3 id="top">Create Test</h3>

        {!testSelected ? (
          <Paper component={Box} p={4} m={3} className={classes.test_paper}>
            <Container>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleFormSubmit(e);
                }}
              >
                <br />

                <FormControl
                  variant="outlined"
                  id="outlined-basic"
                  className={classes.formControl}
                  style={{ width: 400 }}
                >
                  <TextField
                    id="outlined-basic"
                    label="Test Name"
                    variant="outlined"
                    type="text"
                    required="true"
                    autoComplete="off"
                    onChange={(e) => {
                      if (e.target.value.length <= 40) {
                        testData.title = e.target.value;
                        testData.displayTitle = e.target.value;
                        settitleLength(e.target.value.length);
                      } else {
                        e.target.value = e.target.value.slice(0, 40);
                        user.handleAlert(
                          "error",
                          "Test name should contain less than 40 characters"
                        );
                      }
                    }}
                    style={{ width: 400 }}
                  />
                  <small style={{ width: 400 }}>
                    &nbsp;(Note : Special characters are not allowed)
                    <span
                      style={{ float: "right" }}
                    >{`${titleLength}/40`}</span>
                  </small>
                </FormControl>
                {/* <FormControl
                  variant="outlined"
                  id="outlined-basic"
                  className={classes.formControl}
                  style={{ width: 400 }}
                >
                  <Select
                    style={{ width: "20rem" }}
                    native
                    required={true}
                    onChange={(e) => {
                      testData.courseID = e.target.value;
                      console.log(e.target.value);
                    }}
                  >
                    <option value="">Select Course*</option>
                    {course.map((c) => {
                      return (
                        <option value={c.ID}>
                          {c.name}({c.ID})
                        </option>
                      );
                    })}
                  </Select>
                </FormControl> */}
                <Grid item>
                  <div class="d-flex  mt-2 mb-2">
                    <div style={{ marginRight: "1rem" }}>
                      <FormControl
                        variant="outlined"
                        id="outlined-basic"
                        label="Track"
                        className={classes.formControl}
                      >
                        <Select
                          style={{ width: "20rem" }}
                          native
                          required={true}
                          onChange={(e) => {
                            testData.trackName = e.target.value;
                            if (e.target.value != "default") {
                              user.setisLoading(true);
                              getSubCompetency(e.target.value);
                            } else {
                              user.setisLoading(true);
                              setSubcompetencies([]);
                              user.setisLoading(false);
                            }
                          }}
                        >
                          <option value="default">Select Competency*</option>
                          {competencies.length > 0
                            ? competencies.map((competency) => {
                                return (
                                  <option value={competency}>
                                    {competency}
                                  </option>
                                );
                              })
                            : ""}
                        </Select>
                      </FormControl>
                    </div>
                    <div>
                      {/* <br /> */}
                      {/* <FormControl
                        variant="outlined"
                        id="outlined-basic"
                        label="Track"
                        className={classes.formControl}
                      >
                        <Select
                          style={{ width: "20rem" }}
                          native
                          required={true}
                          onChange={(e) => {
                            testData.subCompetency = e.target.value;
                          }}
                        >
                          <option value="">Select Sub Competency*</option>
                          {testData.trackName != "default"
                            ? subcompetencies.map((subc) => {
                                return <option value={subc}>{subc}</option>;
                              })
                            : ""}
                        </Select>
                      </FormControl> */}
                    </div>
                  </div>
                </Grid>
                <div
                  variant="outlined"
                  id="outlined-basic"
                  className={classes.formControl}
                  style={{ width: 400 }}
                >
                  <label htmlFor="file=upload">
                    Upload file of participants usernames(.xlsx)*
                  </label>
                  <div className="input-group mb-3">
                    <input
                      type="file"
                      required={true}
                      onChange={fileHandler}
                      style={{
                        padding: "10px",
                        border: "0.01rem solid gray",
                      }}
                      accept=".xlsx,.csv"
                    />
                    <small>
                      (Note: Size of Excel should be less than 100 KB)
                    </small>
                  </div>
                </div>
                <FormControl
                  variant="outlined"
                  id="outlined-basic"
                  className={classes.formControl}
                  style={{ width: 400 }}
                >
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DateTimePicker
                      value={testData.startTime}
                      // disabled={isDisabled ? true : false}
                      // id="datetime-local"
                      label="Start Date and Time"
                      // type="datetime-local"
                      defaultValue={Date.now()}
                      required={true}
                      // className={classes.endTime}
                      onChange={(e) => {
                        if (new Date(e._d) > Date.now()) {
                          settestData({ ...testData, startTime: e._d });
                          setisDisabled(false);
                        } else {
                          user.handleAlert(
                            "error",
                            `Date and Time should be greater than current time`
                          );
                        }
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
                <FormControl
                  variant="outlined"
                  id="outlined-basic"
                  className={classes.formControl}
                  style={{ width: 400 }}
                >
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DateTimePicker
                      value={testData.endTime}
                      disabled={isDisabled ? true : false}
                      // id="datetime-local"
                      label="End Date and Time"
                      // type="datetime-local"
                      defaultValue="YYYY-MM-DDT10:30"
                      required={true}
                      // className={classes.endTime}
                      onChange={(e) => {
                        if (
                          new Date(e._d) > Date.now() &&
                          new Date(e._d) > testData.startTime
                        ) {
                          settestData({ ...testData, endTime: e._d });
                        } else {
                          user.handleAlert(
                            "error",
                            `Date and Time should be greater than current and Starting time of the Test`
                          );
                        }
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
                <Grid item style={{ marginTop: 20 }}>
                  <FormControl className={classes.formControl}>
                    {" "}
                    <button
                      type="submit"
                      className="btn btn-primary hvr-float-shadow btn-submit"
                      onClick={(e) => {
                        settestData({ ...testData, createdAt: Date.now() });
                      }}
                    >
                      Next
                    </button>
                  </FormControl>
                </Grid>
                {/* </Grid> */}
              </form>
            </Container>
          </Paper>
        ) : (
          <AssignmentSelect />
        )}
      </Grid>
    </TestDataFunctions.Provider>
  );
}

export default AddTest;
