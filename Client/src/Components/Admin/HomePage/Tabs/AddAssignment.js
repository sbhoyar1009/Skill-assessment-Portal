import React, { useState, useEffect, useContext } from "react";
import ReactSearchBox from "react-search-box";
import { FaSearch } from "react-icons/fa";
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
import { useStyles } from "../../../../Assets/Styles/jsStyles";
import { UserContext } from "../../../../App";
import {
  addAssignmentToExistingTest,
  GetAllAssignments,
  GetAssignmentsofTest,
} from "../../../../Util/assignment";
import { cleanTitle } from "../../../../Util/regex";

const AddAssignment = (props) => {
  const [checked, setChecked] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [searchedAssignments, setSearchedAssignments] = React.useState([]);
  const [searchValue, setsearchValue] = React.useState("");
  const { testId, testData } = props;
  const classes = useStyles();
  const user = useContext(UserContext);
  let getAssignments = async (id) => {
    user.setisLoading(true);
    GetAssignmentsofTest(id)
      .then((res) => {
        let TestAssignmentsIds = res.data.assignments.map((x) => {
          return x._id;
        });
        GetAllAssignments(testData.trackName, testData.subCompetency)
          .then((r) => {
            let assign = [];
            let data = r.data.slice(0).reverse();
            for (let i = 0; i < data.length; i++) {
              const a = data[i];
              if (!TestAssignmentsIds.includes(a._id)) {
                assign.push(a);
              } else {
                console.log("Assignment already present");
              }
            }
            setAssignments(assign);
            // console.log(assign);
            user.setisLoading(false);
          })
          .catch((err) => {
            console.log(err);
            user.setisLoading(false);
          });
      })
      .catch((err) => {
        console.log(err);
        user.setisLoading(false);
      });
  };

  useEffect(() => {
    getAssignments(testId);
  }, [testId]);

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
    }

    setChecked(newChecked);
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
    assignments.forEach((assignment) => {
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

  const updateTest = (checkedAssignments) => {
    user.setisLoading(true);

    addAssignmentToExistingTest({
      testId: testId,
      assignments: checkedAssignments,
    })
      .then((res) => {
        if (res.data.status === "success") {
          user.handleAlert("success", "Assignments added successfully");

          getAssignments(testId);
        } else {
          user.handleAlert("error", "Error while adding assignments");
        }
        setChecked([]);
        user.setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setChecked([]);
        user.setisLoading(false);
        user.handleAlert("error", "Something went wrong");
      });
  };
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateTest(checked);
        }}
      >
        <Paper className={classes.ass_paper}>
          {assignments && assignments.length > 0 ? (
            <>
              <Grid container m={1}>
                <Grid item xs={6}>
                  <div
                    className="text-center assgn-list-heading"
                    style={{ margin: "0", marginTop: "1rem" }}
                  >
                    <strong>Select Assignment</strong>
                  </div>
                  <List
                    dense
                    component="div"
                    role="list"
                    className="assgn-list-1"
                  >
                    {assignments && assignments.length > 0 ? (
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
                      <div className="container">
                        {" "}
                        No assignments to display
                      </div>
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
                <Grid item style={{ marginLeft: "20px", marginBottom: "20px" }}>
                  <button
                    variant="contained"
                    type="submit"
                    className="btn hvr-float-shadow"
                  >
                    Submit
                  </button>
                </Grid>
              </Grid>
            </>
          ) : (
            <div className="container p-5 text-center">
              {" "}
              No assignments remaining to add for {" "}
              <strong>{testData.trackName}</strong>
            </div>
          )}
        </Paper>
      </form>
    </div>
  );
};

export default AddAssignment;
