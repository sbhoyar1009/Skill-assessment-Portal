import React, { useRef, useEffect, useState } from "react";
import { getResultOfAssignment } from "../../Util/result";

const Result = (props) => {
  var resultProps = props.resultProps;
  const { testId, assignmentID, username } = resultProps;
  const [result, setresult] = useState(null);
  // const result = useRef(null);
  useEffect(() => {
    getResultOfAssignment(testId, assignmentID, username)
      .then((res) => {
        // result.current = res.data;
        setresult(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log("Error in result:", err);
      });
  }, []);
  return (
    <div className="result">
      {result && result.submitted ? (
        <div>
          <div>
            <p>
              <strong>Recent score: </strong>
              {result.recentScore}
            </p>
            <p>
              <strong>Recent commit: </strong>
              {result.assignmentResult.cxxtest !== undefined ? (
                result.assignmentResult.cxxtest.summary.jobStatus ===
                "FAILED" ? (
                  <>
                    <span>
                      <strong>Failed </strong>
                    </span>
                    <br />
                    <span>
                      <small style={{ color: "red" }}>
                        (Execution failed due to some error)
                      </small>
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      <strong>Successful</strong>
                    </span>
                  </>
                )
              ) : result.assignmentResult.summary !== undefined ? (
                result.assignmentResult.summary.jobStatus === "FAILED" ? (
                  <>
                    <span>
                      <strong>Failed </strong>
                    </span>
                    <br />
                    <span>
                      <small style={{ color: "red" }}>
                        (Execution failed due to some error)
                      </small>
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      <strong>Successful</strong>
                    </span>
                  </>
                )
              ) : (
                "NA"
              )}
            </p>
            <p>
              <strong>Best score: </strong>
              {result.bestScore}
            </p>
          </div>
          <div
            style={{
              margin: "10px",
              fontFamily: "Work Sans, sans-serif",
              fontSize: "13px",
              fontWeight: "400",
              lineHeight: "1.5",
              color: "#212529",
              textAlign: "center",
              backgroundColor: "#fff",
            }}
          >
            <h6
              style={{
                marginTop: "0",
                marginBottom: "3px",
                fontWeight: "500",
                lineHeight: "1.2",
                fontSize: "13px",
              }}
            >
              Auto Evaluation Summary of Recent Commit
            </h6>
            {/* <h6
              style={{
                marginTop: "0",
                marginBottom: "3px",
                fontWeight: "500",
                lineHeight: "1.2",
                fontSize: "13px",
              }}
            >
              Auto Evaluation Summary For Repository{" "}
              <a
                style={{
                  color: "#622ADB",
                  textDecoration: "none",
                  backgroundColor: "transparent",
                }}
                href="https://gitlab.kpit.com/ebdtrack/cipdtest/userstestgroups-dummy/testingonserver-gauravr3/assignment-6"
              >
                {result.assignmentResult.cloc.jobUrl}
              </a>{" "}
              | Branch/Tag{" "}
              <a
                style={{
                  color: "#622ADB",
                  textDecoration: "none",
                  backgroundColor: "transparent",
                }}
                href="https://gitlab.kpit.com/ebdtrack/cipdtest/userstestgroups-dummy/testingonserver-gauravr3/assignment-6/tree/{branch}"
              >
                master
              </a>
            </h6> */}
            <hr
              style={{
                height: "1px",
                color: "#cfd5db",
                backgroundColor: "#cfd5db",
                border: "none",
                padding: "0 0 0 0",
                margin: "0 0 0 0",
              }}
            />

            <table
              align="center"
              style={{
                fontFamily: "Work Sans, sans-serif",
                fontSize: "13px",
                borderCollapse: "collapse",
                width: "auto",
                marginTop: "12px",
                marginBottom: "12px",
                color: "#212529",
                border: "1px solid #cfd5db",
              }}
            >
              {/* <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  GitLab CI Pipeline:
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  <a
                    style={{
                      color: "#622ADB",
                      textDecoration: "none",
                      backgroundColor: "transparent",
                    }}
                    href="https://gitlab.kpit.com/ebdtrack/cipdtest/userstestgroups-dummy/testingonserver-gauravr3/assignment-6/-/pipelines/386423"
                  >
                    #386423
                  </a>
                </td>
              </tr> */}
              {/* <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  Trigger Source
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  push
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  Triggered By
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  <a
                    style={{
                      color: "#622ADB",
                      textDecoration: "none",
                      backgroundColor: "transparent",
                    }}
                    href="http://gitlab.kpit.com/gauravr3"
                  >
                    Gaurav Rasal
                  </a>
                </td>
              </tr> */}

              <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  Files Analysed
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  {result.assignmentResult.cloc &&
                  result.assignmentResult.cloc.numberOfFiles
                    ? result.assignmentResult.cloc.numberOfFiles
                    : "NA"}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  Total LOC
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  {result.assignmentResult.cloc &&
                  result.assignmentResult.cloc.lineOfCode
                    ? result.assignmentResult.cloc.lineOfCode
                    : "NA"}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  Percent Comments
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                  data-toggle="tooltip"
                  data-placement="bottom"
                >
                  {result.assignmentResult.cloc &&
                  result.assignmentResult.cloc.per_comment
                    ? result.assignmentResult.cloc.per_comment + "%"
                    : "NA"}
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  Percent Duplication
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                  data-toggle="tooltip"
                  data-placement="bottom"
                >
                  {result.assignmentResult.cpd &&
                  result.assignmentResult.cpd.summary.duplication
                    ? result.assignmentResult.cpd.summary.duplication + "%"
                    : "NA"}
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  Functions With Complexity Above Threshold
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                  data-toggle="tooltip"
                  data-placement="bottom"
                >
                  {result.assignmentResult.lizard &&
                  result.assignmentResult.lizard.summary &&
                  result.assignmentResult.lizard.summary.functionsAboveThreshold
                    ? result.assignmentResult.lizard.summary
                        .functionsAboveThreshold
                    : "NA"}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  Most Complex Function
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  {result.assignmentResult.lizard &&
                  result.assignmentResult.lizard.summary &&
                  result.assignmentResult.lizard.summary.maxComplexFunction
                    ? result.assignmentResult.lizard.summary.maxComplexFunction
                    : "NA"}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  Complexity Of Most Complex Function
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                  data-toggle="tooltip"
                  data-placement="bottom"
                >
                  {result.assignmentResult.lizard &&
                  result.assignmentResult.lizard.summary &&
                  result.assignmentResult.lizard.summary.maxComplexity
                    ? result.assignmentResult.lizard.summary.maxComplexity
                    : "NA"}
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  Recent Score
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                  data-toggle="tooltip"
                  data-placement="bottom"
                >
                  {result.recentScore ? result.recentScore : "NA"}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  Number of Attempts
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                  data-toggle="tooltip"
                  data-placement="bottom"
                >
                  {result.attemptNumber ? result.attemptNumber : "NA"}
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                >
                  Last updated
                </td>
                <td
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    verticalAlign: "middle",
                    border: "1px solid #cfd5db",
                  }}
                  data-toggle="tooltip"
                  data-placement="bottom"
                >
                  {result.lastUpdated ? result.lastUpdated : "NA"}
                </td>
              </tr>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <small>Result will be available once you push the code</small>
        </div>
      )}
    </div>
  );
};

export default Result;
