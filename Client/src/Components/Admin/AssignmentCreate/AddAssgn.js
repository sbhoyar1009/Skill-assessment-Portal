import React, { createContext, useState, useContext, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Box,
  TextField,
  Button,
  FormControl,
  Select,
} from "@material-ui/core";
import Multiselect from 'multiselect-react-dropdown';
import { getAllCompetencies, getSubCompetencies } from "../../../Util/test";
import { addAssignstyles } from "../../../Assets/Styles/jsStyles";
import {
  AddAssignment,
  checkAssignment,
  GetAllAssignmentsofGitlab,
} from "../../../Util/assignment";
import { UserContext } from "../../../App";
import { checkSpecialChars } from "../../../Util/regex";
export const AssignmentInfo = createContext(null);

function AddAssgn() {
  const userData = useContext(UserContext);
  const [assignments, setassignments] = useState([]);
  const [competencies, setcompetencies] = useState([]);
  const [subcompetencies, setSubcompetencies] = useState([]);
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    gitlabUserProjectId: "",
    Competency: "",
    subCompetencies: [],
    level: ""
  });

  useEffect(() => {
    getAllCompetencies().then((res) => {
      setcompetencies(res.data);
    });
    GetAllAssignmentsofGitlab().then((res) => {
      console.log(res.data)
      setassignments(res.data);
    });
  }, []);

  const [PDF, setPDF] = useState({});
  const classes = addAssignstyles();

  const handlePdf = (e) => {
    const filename = e.target.files[0].name;
    const fileExtension = filename.split(".").pop();
    if (fileExtension !== "pdf") {
      e.target.value = null;
      userData.handleAlert("error", "Please upload .pdf file");
    } else {
      if (e.target.files[0].size / 1024 > 1024) {
        e.target.value = null;
        userData.handleAlert("error", "File size exceeded");
      } else {
        setPDF(e.target.files[0]);
      }
    }
  };

  const getSubCompetency = (Competency) => {
    getSubCompetencies(Competency).then((res) => {
      setSubcompetencies(res.data);
  //     setSubcompetencies([{
  //       name: "Operatores",
  //       id:1
  //     },
  //   {
  //     name: "Functions",
  //     id:1
  //   },{
  //   name: "better.com",
  //   id:1
  // }
    
  //   ])
      console.log(res.data);
      userData.setisLoading(false);
    });
  };
 
  const createAssignment = () => {
    let { title, gitlabUserProjectId, Competency, subCompetencies,level } =
      assignmentData;
      console.log(assignmentData);
      console.log(level)
    for (let i = 0; i < assignments.length; i++) {
      if (assignments[i].name === title) {
        gitlabUserProjectId = assignments[i].id;
        break;
      }
    }
    if (checkSpecialChars(title)) {
      checkAssignment(title)
        .then((res) => {
          if (res.data.status) {
            userData.setisLoading(false);
            userData.handleAlert("error", `Assignment already exists`);
          } else {
            var formData = new FormData();
            if (PDF) {
              formData.append("pdf", PDF);
              formData.append("file", true);
            }
            formData.append("title", title.trim());
            formData.append("gitlabUserProjectId", gitlabUserProjectId);
            formData.append("Competency", Competency);
            formData.append("subCompetencies", subCompetencies);
            formData.append("level", level);
            AddAssignment(formData)
              .then((res) => {
                if (res.data.status === "success") {
                  setAssignmentData({ title: "", gitlabUserProjectId: "" });
                  document.getElementsByName("pdf-upload")[0].value = "";
                  userData.setisLoading(false);
                  userData.handleAlert(
                    "success",
                    `Assignment created successfully`
                  );
                } else {
                  userData.setisLoading(false);
                  console.log("error:", res);
                  userData.handleAlert("error", `${res.data.status}`);
                }
              })
              .catch((err) => {
                console.error(err);
                //userData.setisLoading(false);
                userData.handleAlert("error", `Error in creating assignment`);
              });
            userData.setisLoading(false);
          }
        })
        .catch(() => {
          userData.setisLoading(false);
        });
    } else {
      userData.setisLoading(false);
      userData.handleAlert("error", `Special Characters are not allowed`);
    }
  };

  const assignInfo = {
    assignmentData,
    setAssignmentData,
    createAssignment,
  };

  return (
    <AssignmentInfo.Provider value={assignInfo}>
      <h3>Add an Assignment</h3>

      <Container className={classes.root}>
        <Paper
          component={Box}
          p={3}
          m={1}
          className={classes.testCasePaper}
          style={{ width: "90%" }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              userData.setisLoading(true);
              createAssignment();
            }}
          >
            <Grid container spacing={2} className={classes.formControl}>
              <Grid item xs={12}>
                <div className="form-group">
                  <FormControl
                    variant="outlined"
                    id="outlined-basic"
                    label="Title"
                    className={classes.formControl}
                    style={{ width: "20rem", padding: "0.5rem 0" }}
                  >
                    <input
                      list="assgn-list"
                      className="form-control"
                      id="form-assgn-list"
                      type="list"
                      name="title"
                      placeholder="Assignment Title"
                      onChange={(e) => {
                        assignmentData.title = e.target.value;
                      }}
                      // invalid={showError && userInfo.errors.state.length > 0}
                      required
                    />
                    <datalist
                      id="assgn-list"
                      native
                      required={true}
                      name="title"
                      defaultValue={assignmentData.title}
                    >
                      {/* <option value="">Select Assignment*</option> */}
                      {assignments && assignments.length > 0
                        ? assignments.map((assignment) => {
                            return (
                              <option
                                key={assignment.name}
                                value={assignment.name}
                              >
                                {assignment.name}
                              </option>
                            );
                          })
                        : ""}
                    </datalist>
                  </FormControl>

                  <br />

                  <div class="d-inline-flex  mt-3">
                    <div style={{ marginRight: "1rem" }}>
                      <FormControl
                        variant="outlined"
                        id="outlined-basic"
                        label="Track"
                        className={classes.formControl}
                        style={{ width: "20rem" }}
                      >
                        <Select
                          style={{ width: "20rem" }}
                          native
                          required={true}
                          onChange={(e) => {
                            assignmentData.Competency = e.target.value;
                            if (e.target.value != "default") {
                              userData.setisLoading(true);
                              console.log(e.target.value);
                              getSubCompetency(e.target.value);
                            } else {
                              userData.setisLoading(true);
                              setSubcompetencies([]);
                              userData.setisLoading(false);
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
                      <FormControl
                        variant="outlined"
                        id="outlined-basic"
                        label="Track"
                        className={classes.formControl}
                        style={{ width: "20rem" }}
                      >
                        <Select
                          style={{ width: "20rem" }}
                          native
                          required={true}
                          onChange={(e) => {
                            // assignmentData.difficulty = e.target.value;
                            // console.log(e.target.value)
                            setAssignmentData({...assignmentData,"level":e.target.value})
                          }}
                        >
                          <option value="">Select Difficulty Level</option>
                          <option value="L1">L1</option>
                          <option value="L2">L2</option>
                          <option value="L3">L3</option>
                          <option value="L4">L4</option>
                          
                        </Select>
                      </FormControl>
                   

                    </div>
                    
                  </div>
                  <br>
                  </br>
                  <br></br>
                  <div>
                      <FormControl
                        variant="outlined"
                        id="outlined-basic"
                        label="Track"
                        className={classes.formControl}
                        style={{ width: "20rem" }}
                      >
                        <label>
                        Select all subcompetencies that apply
                        </label>
                         <Multiselect
                            isObject={false}
                            options={subcompetencies}
                            placeholder="Select subCompetency"
                            onSelect={((event)=> {
                              assignmentData.subCompetencies = event
                              console.log(event)
                            })}
                            onRemove={((event)=> {
                              assignmentData.subCompetencies = event
                            })}
                            ></Multiselect>
                      </FormControl>
                    </div>
                  {/* <div>
                    <small>
                      (Note : Assignment title should be same as the project
                      name on gitlab.)
                    </small>
                  </div> */}
                </div>
              </Grid>

              <Grid item xs={12} style={{ marginTop: "-1rem" }}>
                <label for="pdf-upload">Upload PDF*</label>
                <div className="">
                  <input
                    type="file"
                    name="pdf-upload"
                    style={{
                      padding: "10px",
                      border: "0.01rem solid gray",
                      width: "300px",
                    }}
                    onChange={(e) => {
                      handlePdf(e);
                    }}
                    required={true}
                    accept="application/pdf"
                  />
                </div>
                <small>(Note : Size of PDF should be less than 1 MB)</small>
              </Grid>

              <Grid item style={{ marginLeft: "15px", marginTop: "1rem" }}>
                <button className="btn hvr-float-shadow" type="submit">
                  Submit
                </button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </AssignmentInfo.Provider>
  );
}

export default AddAssgn;
