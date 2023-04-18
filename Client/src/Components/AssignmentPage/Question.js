import React, { useState, useContext } from "react";
import { MdContentCopy } from "react-icons/md";
import { Document, Page, pdfjs } from "react-pdf";
import { TestData } from "../TestTrackSelect/TestsPage";
import { UserContext } from "../../App";
import Result from "./Result";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

function TabPanel(props) {
  const { children, value, index, test, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      // style={{ height: "60vh", overflowY: "auto" }}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Question = (props) => {
  let { URL } = props;
  const classes = useStyles();
  const [pages, setpages] = useState(0);
  const [value, setValue] = useState(0);
  const testData = useContext(TestData);
  const userData = useContext(UserContext);
  const file = "/uploads/" + props.content.title + ".pdf";
  const testId = testData.currentTestData.testId;
  const username = userData.user.username;
  const assignmentID = props.content._id;
  const isActive = testData.currentTestData.isActive;

  const resultProps = { testId, username, assignmentID };

  const noPDF = () => {
    return <div className="">No PDF available</div>;
  };

  const PDF = () => {
    try {
      if (isActive) {
        return (
          <Document
            className="pdf-container"
            file={file}
            error={noPDF}
            onLoadSuccess={({ numPages }) => {
              setpages(numPages);
            }}
            onContextMenu={(e) => e.preventDefault()}
          >
            {Array.apply(null, Array(pages))
              .map((x, i) => i + 1)
              .map((page) => (
                <>
                  <Page wrap pageNumber={page} scale={1.5} />
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: 10,
                      backgroundColor: "white",
                    }}
                  >
                    {page}
                  </div>
                </>
              ))}
          </Document>
        );
      } else {
        return (
          <small>
            Test is not Active. You can view your result. To view result, go to
            "Result" Tab. To check your ranking, select "Leaderboard" option in
            the navigation pannel
          </small>
        );
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
  };

  const copyToClipboard = (copyValue) => {
    navigator.clipboard.writeText(copyValue);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className={classes.root}>
      <div className="assignment-title">
        <p className="text-center ">
          <h3>
            <strong>{props.content.title}</strong>
            {console.log(props.content)}
          </h3>
        </p>
      </div>

      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          style={{
            backgroundColor: "#b2ff45fd",
            color: "#000",
          }}
        >
          <Tab label="Problem Statement" {...a11yProps(0)} />
          <Tab label="Instructions" {...a11yProps(1)} />
          <Tab label="Result" {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <div className="assignment" style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              WebkitUserSelect: "none",
            }}
          >
            <PDF />
          </div>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="assignment" style={{ marginBottom: "2rem" }}>
          <p>

          <ul>
  <li>For C++ code,make sure it doesn't contain any std::cout statement</li>
  <li>Copy the below instructions using the copy icon present</li>
  <li>For any git related doubts, visit  {" "}
    <a href="https://docs.github.com/en"  target="_blank"><small>https://docs.github.com/en/</small></a>
    </li>
</ul>
            <strong>Instructions for code submission :</strong>
            <div>
              <ol>
                
                <li>
                  Execute below commands to clone gitlab project to your local
                  machine.
                  <ol
                    type="a"
                    className="my-2 gitlabCommands"
                    style={{ paddingTop: "0.1rem" }}
                  >
                    <li id="gitlabCommand">
                      {" "}
                      <small>
                        git clone {URL.slice(0, 40) + " ... " + URL.slice(-20)}
                        <MdContentCopy
                          className="copyURL"
                          style={{ cursor: "pointer", marginLeft: "5px" }}
                          onClick={() => {
                            copyToClipboard("git clone " + URL);
                          }}
                        />
                      </small>
                    </li>
                    <li id="gitlabCommand">
                      <small>
                        cd{" "}
                        {props.content.title
                          .toLowerCase()
                          .trim()
                          .replace(/\s+/g, "-")}
                        <MdContentCopy
                          className="copyURL"
                          style={{ cursor: "pointer", marginLeft: "5px" }}
                          onClick={() => {
                            copyToClipboard(
                              `cd ${props.content.title
                                .toLowerCase()
                                .trim()
                                .replace(/\s+/g, "-")}`
                            );
                          }}
                        />
                      </small>
                    </li>
                    <li id="gitlabCommand">
                      <small>
                        git checkout -b user
                        <MdContentCopy
                          className="copyURL"
                          style={{ cursor: "pointer", marginLeft: "5px" }}
                          onClick={() => {
                            copyToClipboard(`git checkout -b user`);
                          }}
                        />
                      </small>
                    </li>
                  </ol>
                </li>
                <br />
                <li>
                  Write expected code in correct file as per the instructions
                  given in readme.
                </li>
                <li>
                  Push the written code on the respective GitLab project within
                  given time.
                  <ol
                    type="a"
                    className="my-2 gitlabCommands"
                    style={{ paddingTop: "0.1rem" }}
                  >
                    <li id="gitlabCommand">
                      <small>
                        git add .{" "}
                        <MdContentCopy
                          className="copyURL"
                          style={{ cursor: "pointer", marginLeft: "5px" }}
                          onClick={() => {
                            copyToClipboard(`git add .`);
                          }}
                        />
                      </small>
                    </li>
                    <li id="gitlabCommand">
                      <small>
                        git commit -m "commit message"
                        <MdContentCopy
                          className="copyURL"
                          style={{ cursor: "pointer", marginLeft: "5px" }}
                          onClick={() => {
                            copyToClipboard(`git commit -m "commit message"`);
                          }}
                        />
                      </small>
                    </li>
                    <li id="gitlabCommand">
                      <small>
                        git push --set-upstream origin user
                        <MdContentCopy
                          className="copyURL"
                          style={{ cursor: "pointer", marginLeft: "5px" }}
                          onClick={() => {
                            copyToClipboard(
                              `git push --set-upstream origin user`
                            );
                          }}
                        />
                      </small>
                    </li>
                  </ol>
                </li>
                <li>Come back to the portal and wait for the result.</li>
              </ol>
            </div>
          </p>
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Result resultProps={resultProps} />
      </TabPanel>
      {/* <div className="assignment" style={{ marginBottom: "2rem" }}>
        <p className="text-center">
          <h3>
            <strong>{props.content.title}</strong>
          </h3>
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            WebkitUserSelect: "none",
          }}
        >
          <PDF />
        </div>
        <p>
          <strong>Instructions for code submission :</strong>
          <div>
            <ol>
              <li>
                Execute below commands to clone gitlab project to your local
                machine.
                <ol
                  type="a"
                  className="my-2 gitlabCommands"
                  style={{ paddingTop: "0.1rem" }}
                >
                  <li id="gitlabCommand">
                    {" "}
                    <small>
                      git clone {URL.slice(0, 40) + " ... " + URL.slice(-20)}
                      <MdContentCopy
                        className="copyURL"
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                        onClick={() => {
                          copyToClipboard("git clone " + URL);
                        }}
                      />
                    </small>
                  </li>
                  <li id="gitlabCommand">
                    <small>
                      cd{" "}
                      {props.content.title
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, "-")}
                      <MdContentCopy
                        className="copyURL"
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                        onClick={() => {
                          copyToClipboard(
                            `cd ${props.content.title
                              .toLowerCase()
                              .trim()
                              .replace(/\s+/g, "-")}`
                          );
                        }}
                      />
                    </small>
                  </li>
                  <li id="gitlabCommand">
                    <small>
                      git checkout -b user
                      <MdContentCopy
                        className="copyURL"
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                        onClick={() => {
                          copyToClipboard(`git checkout -b user`);
                        }}
                      />
                    </small>
                  </li>
                </ol>
              </li>
              <br />
              <li>
                Write expected code in correct file as per the instructions
                given in readme.
              </li>
              <li>
                Push the written code on the respective GitLab project within
                given time.
                <ol
                  type="a"
                  className="my-2 gitlabCommands"
                  style={{ paddingTop: "0.1rem" }}
                >
                  <li id="gitlabCommand">
                    <small>
                      git add .{" "}
                      <MdContentCopy
                        className="copyURL"
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                        onClick={() => {
                          copyToClipboard(`git add .`);
                        }}
                      />
                    </small>
                  </li>
                  <li id="gitlabCommand">
                    <small>
                      git commit -m "commit message"
                      <MdContentCopy
                        className="copyURL"
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                        onClick={() => {
                          copyToClipboard(`git commit -m "commit message"`);
                        }}
                      />
                    </small>
                  </li>
                  <li id="gitlabCommand">
                    <small>
                      git push{" "}
                      <MdContentCopy
                        className="copyURL"
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                        onClick={() => {
                          copyToClipboard(`git push`);
                        }}
                      />
                    </small>
                  </li>
                </ol>
              </li>
              <li>Come back to the portal and wait for the result.</li>
            </ol>
          </div>
          {/* <div
            style={{
              padding: "20px 0px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              // onClick={() => {
              //   setSubmitClicked(true);
              //   console.log(submitClicked);
              // }}
              style={{
                backgroundColor: "#b3ff46",
                color: "black",
                padding: "0.5rem 1.5rem",
                fontSize: "18px",
                // marginBottom: "1rem",
                float: "left",
              }}
            >
              <a
                href={`https://gitlab.kpit.com/ebdtrack/cipdtest/userstestgroups-dummy/${
                  testData.currentTestData.testTitle
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "") +
                  "-" +
                  userData.currentstate.user.username.toLowerCase().trim()
                }/${props.content.title
                  .toLowerCase()
                  .trim()
                  .replace(/\s+/g, "-")}`}
                rel="noopener noreferrer"
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                Go To Gitlab
                <FaGitlab style={{ marginLeft: 10 }} />
              </a>
            </Button>
          </div> */}
      {/* </p>
      </div> */}
      {/* <div>
        <Result resultProps={resultProps} />
      </div>  */}
    </div>
  );
};

export default Question;
