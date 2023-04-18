import React, { useState, createContext, useEffect, useContext } from "react";
import ReactSearchBox from "react-search-box";
import { FaSearch } from "react-icons/fa";
import { ImArrowLeft2 } from "react-icons/im";
import {
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Typography,
} from "@material-ui/core";
import { useStyles } from "../../../Assets/Styles/jsStyles";
import { GetAllAssignments,getAllSubCompetencies } from "../../../Util/assignment";
import { addTestToDataBase } from "../../../Util/test";
import { cleanTitle } from "../../../Util/regex";
import { TestDataFunctions } from "./AddTest";
import { UserContext } from "../../../App";

const AssignmentSelect = () => {
  const [checked, setChecked] = React.useState([]);
  const [assignments, setAssignments] = React.useState([]);
  const [subcompetencies,setSubcompetencies] = React.useState([]);
  const [searchedAssignments, setSearchedAssignments] = React.useState([]);
  const [searchValue, setsearchValue] = React.useState("");
  const classes = useStyles();
  const testFunctions = useContext(TestDataFunctions);
  const user = useContext(UserContext);

  let getAssignments = async () => {
    user.setisLoading(true);
    console.log(testFunctions);
    GetAllAssignments(testFunctions.testData.trackName).then((res)=>{
      // testFunctions.testData.trackName,
        console.log(res.data);
        setAssignments(res.data.slice(0).reverse());
        user.setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        user.setisLoading(false);
      });
  };

  useEffect(() => {
    getAssignments();
  }, []);

  const addTestToDb = (test) => {
    return addTestToDataBase(test);
  };
  const back = () => {
    testFunctions.settestSelected(false);
    testFunctions.settitleLength(0);
  };
  const displaySearchAssignments = (value) => {
    setsearchValue(value);
    if (value !== null && value !== "" && value !== undefined) {
      const newSearchedAssignments = assignments.filter((assignment) => {
        const regex = new RegExp(`${cleanTitle(value)}`, "gi");
        return assignment.title.match(regex);
      });
      setSearchedAssignments(newSearchedAssignments);
    } else {
      setSearchedAssignments([]);
      // getAssignments();
    }
  };
  //when unchecked it moves the assignment to last
  const removeAssignment = (value) => {
    var id = value._id;
    var newAssignments = [];
    assignments.map((assignment) => {
      if (assignment._id !== id) {
        newAssignments.push(assignment);
      }
    });
    newAssignments.push(value);
    setAssignments(newAssignments);
  };

  //when checked it moves assignment to top
  const addAssignment = (value) => {
    var id = value._id;
    var newAssignments = [value];
    assignments.map((assignment) => {
      if (assignment._id !== id) {
        newAssignments.push(assignment);
      }
    });
    setAssignments(newAssignments);
  };

  const updateSubCompetencies= async(c)=>{
    await c.forEach(async(singleAssignment)=>{
    await  getAllSubCompetencies(singleAssignment).then((res)=>{
        console.log(res)
        // subcs.push(res.data)
        setSubcompetencies([...subcompetencies,...(res.data)])
        console.log(res.data)
      }).catch((err)=>{
        console.log("Some error")
      })
    })

  }
  const handleToggle = (value) => () => {
    // console.log("Toggle:", value);
    var index = value._id;
    const currentIndex = checked.indexOf(index);
    // console.log("Sr:", currentIndex);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(index);
      addAssignment(value);
      
    } else {
      newChecked.splice(currentIndex, 1);
      removeAssignment(value);
      console.log(value)
    }

    setChecked(newChecked);
    console.log("checked:", checked);
  };

  const createTest = async (c) => {
    user.setisLoading(true);
    console.log(c);
    if (c.length > 0) {
      let newTest = { ...testFunctions.testData };
      newTest.assignments = c;
      // newTest.subCompetency = subcompetencies;
      addTestToDb(newTest)
        .then((res) => {
          testFunctions.settestSelected(false);
          getAssignments();
          setChecked([]);
          setAssignments(assignments);
          user.setisLoading(false);
          user.handleAlert("success", `Test created successfully`);
          document
            .getElementById("v-pills-tabContent")
            .children[0].setAttribute("class", "tab-pane fade active show");
          document
            .getElementById("v-pills-tabContent")
            .children[3].setAttribute("class", "tab-pane fade");

          document
            .getElementById("v-pills-home-tab")
            .setAttribute("class", "nav-link active");
          document
            .getElementById("v-pills-add-test-tab")
            .setAttribute("class", "nav-link");
        })
        .catch((err) => {
          user.setisLoading(false);
          console.log(err);
        });

      testFunctions.settestData({
        title: "",
        trackName: "",
        assignments: [],
        participants: [],
        startTime: null,
        endTime: null,
      });
      testFunctions.settitleLength(0);
    } else {
      user.setisLoading(false);
      user.handleAlert("error", `Select atleast one assignment`);
    }
  };
  return (
    <div>
      <>
        <div
          onClick={back}
          style={{
            fontWeight: "600",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "40px",
            height: "40px",
            zIndex: "10",
            color: "black",
            borderRadius: "100%",
            backgroundColor: "#b2ff45fd",
            marginLeft: "20px",
          }}
        >
          <ImArrowLeft2 />
        </div>
        <Paper className={classes.ass_paper} m={2} style={{ padding: "1rem" }}>
          <div className="container mt-5">
            <div className="row m-3">
              {" "}
              <Typography m={2}>
                <strong>Test Name: </strong> {testFunctions.testData.title}
              </Typography>
            </div>
            <div className="row m-3">
              {" "}
              <Typography m={2}>
                <strong>Competency :</strong> {testFunctions.testData.trackName}{" "}
                &emsp; &emsp;
              </Typography>
              {/* <Typography m={2}>
                <strong>Sub-Competency : </strong>{" "}
                {testFunctions.testData.subCompetency}
              </Typography> */}
            </div>

            <div className="row m-3">
              <Typography>
                <strong>Participants: </strong>
                {testFunctions.testData.participants.length}
              </Typography>
            </div>
          </div>
        </Paper>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateSubCompetencies(checked);
            createTest(checked);
          }}
        >
          <Paper className={classes.ass_paper}>
            <Grid container m={1}>
              <Grid item xs={6}>
                <div
                  className="text-center assgn-list-heading"
                  style={{ margin: "0", marginTop: "1rem" }}
                >
                  <strong>Select Assignments</strong>
                </div>
                <List dense component="div" role="list" className="assgn-list">
                  {assignments.length > 0 ? (
                    assignments.map((value) => {
                      const labelId = `transfer-list-item-${value._id}-label`;

                      return (
                        <ListItem
                          key={value._id}
                          role="listitem"
                          button
                          onClick={handleToggle(value)}
                        >
                          <ListItemText
                            id={labelId}
                            primary={`${value.title}`}
                          />
                          <ListItemIcon key={value._id}>
                            <Checkbox
                              checked={checked.indexOf(value._id) !== -1}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                              color="#b0ff45"
                            />
                          </ListItemIcon>
                        </ListItem>
                      );
                    })
                  ) : (
                    <small>
                      No assignments available for this competency
                    </small>
                  )}
                  <ListItem />
                </List>
              </Grid>
              <Grid item xs={6}>
                <Grid
                  item
                  xs={6}
                  style={{ display: "flex", margin: "2rem auto 0" }}
                >
                  <ReactSearchBox
                    id="search"
                    placeholder={"Search Assignment.."}
                    onChange={(value) => displaySearchAssignments(value)}
                    className={classes.searchBox}
                  />

                  <FaSearch
                    style={{
                      height: "20px",
                      width: "20px",
                      margin: "auto",
                    }}
                  />
                </Grid>
                {searchValue.length > 0 ? (
                  <List
                    dense
                    component="div"
                    role="list"
                    className="assgn-list"
                  >
                    {searchedAssignments.length > 0 ? (
                      searchedAssignments.map((value) => {
                        const labelId = `transfer-list-item-${value._id}-label`;

                        return (
                          <ListItem
                            key={value._id}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                          >
                            <ListItemText
                              id={labelId}
                              primary={`${value.title}`}
                            />
                            <ListItemIcon key={value._id}>
                              <Checkbox
                                checked={checked.indexOf(value._id) !== -1}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                                color="#b0ff45"
                              />
                            </ListItemIcon>
                          </ListItem>
                        );
                      })
                    ) : (
                      <div className="assgn-list">
                        <p
                          style={{
                            width: "90%",
                            textAlign: "center",
                            marginTop: "20px",
                            opacity: "40%",
                          }}
                        >
                          No matches found
                        </p>
                      </div>
                    )}
                    <ListItem />
                  </List>
                ) : (
                  <div className="assgn-list">
                    <p
                      style={{
                        width: "90%",
                        textAlign: "center",
                        marginTop: "20px",
                        opacity: "40%",
                      }}
                    >
                      Searched assignments will appear here
                    </p>
                  </div>
                )}
              </Grid>
            </Grid>
            <Grid container>
              <Grid item style={{ margin: "20px" }}>
                <button
                  variant="contained"
                  type="submit"
                  className="btn hvr-float-shadow"
                >
                  Create Test
                </button>
              </Grid>
            </Grid>
          </Paper>
        </form>
      </>
    </div>
  );
};

export default AssignmentSelect;
