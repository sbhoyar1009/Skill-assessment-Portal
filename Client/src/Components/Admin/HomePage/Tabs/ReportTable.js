import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import { StyledTableRow } from "../../../../Assets/Styles/jsStyles";
import { MdPictureAsPdf } from "react-icons/md";

import { ExportToCsv } from "export-to-csv";

import { getResultsofTest } from "../../../../Util/leaderboard";
import { UserContext } from "../../../../App";
import { ModalManager } from "react-dynamic-modal";
import CustomModal from "../../Report/CustomModal";
import { getResultOfAssignment } from "../../../../Util/result";

export default function ReportTable(props) {
  let records;
  let ResultHeader = [];
  const [result, setresult] = useState([]);
  const [allAssignments, setallAssignments] = useState([]);

  let userContext = useContext(UserContext);

  useEffect(() => {
    userContext.setisLoading(true);
    getResultsofTest(props.testID)
      .then((res) => {
        let { leaderBoard, assignments } = res.data;
        setresult(leaderBoard);
        setallAssignments(assignments.reverse());
        userContext.setisLoading(false);
      })
      .catch((err) => {
        console.log(err);
        userContext.setisLoading(false);
      });
  }, [props.testID]);

  const openModal = (title, res, i) => {
    // console.log(res);
    console.log("data : ", res);
    console.log("title : ", title);
    let username = res.username;
    getResultOfAssignment(
      props.testID,
      res.userAssignmentResults[i].assignmentID,
      username
    ).then(async (res) => {
      // console.log(res.data);
      if (res.data.assignmentResult) {
        ModalManager.open(
          <CustomModal
            data={res.data}
            username={username}
            title={res.data.assignmentTitle}
            testName={props.testName}
            index={i}
            onRequestClose={() => true}
          />
        );
      } else {
        userContext.handleAlert("warning", "No submissions yet");
      }
    });
    // ModalManager.open(
    //   <CustomModal data={result} title={title} index={i} onRequestClose={() => true} />
    // );
  };

  const createcsv = () => {
    const options = {
      fieldSeparator: ",",
      quoteStrings: '"',
      decimalSeparator: ".",
      showLabels: true,
      useTextFile: false,
      useKeysAsHeaders: true,
      filename:
        props.testName +
        "-" +
        new Date().toISOString().split("T")[0] +
        "-Reports",
    };
    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(records);
  };

  if (result !== undefined && result.length > 0) {
    ResultHeader.push("Rank");
    ResultHeader.push("Username");

    const Assignments = result[0].userAssignmentResults.map((assignment) => {
      return assignment.assignmentTitle;
    });
    ResultHeader = [...ResultHeader, ...allAssignments, "Total Score"];

    records = result.map((resultRecord) => {
      let record = {};
      record.Rank = resultRecord.rank;
      record.Username = resultRecord.username;
      resultRecord.userAssignmentResults.forEach((assignment) => {
        record[assignment.assignmentTitle] = assignment.bestScore;
      });
      record["Total Score"] = resultRecord.totalScore;
      return record;
    });
  }

  return (
    <div>
      {result !== undefined && result.length !== 0 ? (
        <>
          <Paper>
            {records !== undefined ? (
              <button
                className="btn btn-download"
                onClick={createcsv}
                style={{
                  margin: "0.2rem 1rem 1rem 1rem",
                  float: "right",
                  backgroundColor: "#b2ff45fd",
                }}
              >
                Download Report
              </button>
            ) : (
              ""
            )}
            <TableContainer style={{ overflowX: "scroll", width: "100%" }}>
              <Table
                aria-label="simple table"
                options={{ export: true, exportButton: true }}
              >
                <TableBody>
                  <StyledTableRow>
                    {ResultHeader !== undefined &&
                      ResultHeader.map((headerCell) => {
                        return (
                          <TableCell align="center">
                            <strong>{headerCell}</strong>
                          </TableCell>
                        );
                      })}
                  </StyledTableRow>
                  {result !== undefined &&
                    result.map((resultRecord, i) => {
                      //console.log(results);
                      return (
                        <StyledTableRow key={resultRecord.username}>
                          <TableCell align="center">
                            {resultRecord.rank !== undefined
                              ? resultRecord.rank
                              : "NA"}
                          </TableCell>
                          <TableCell align="center">
                            {resultRecord.username}
                          </TableCell>
                          {resultRecord.userAssignmentResults &&
                            resultRecord.userAssignmentResults.map(
                              (assignment, ind) => {
                                return (
                                  <TableCell
                                    hover
                                    align="center"
                                    key={assignment.assignmentTitle}
                                    data-toggle="tooltip"
                                    data-placement="top"
                                    title="Click to view detailed result"
                                  >
                                    {assignment.bestScore !== undefined
                                      ? assignment.bestScore
                                      : "NA"}

                                    <MdPictureAsPdf
                                      size={20}
                                      style={{
                                        marginLeft: "10px",
                                        cursor: "pointer",
                                        color: "grey",
                                      }}
                                      onClick={() => {
                                        openModal(
                                          assignment.displayTitle,
                                          resultRecord,
                                          ind
                                        );
                                      }}
                                    />
                                  </TableCell>
                                );
                              }
                            )}
                          <TableCell align="center">
                            {resultRecord.totalScore !== undefined
                              ? resultRecord.totalScore
                              : "NA"}
                          </TableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      ) : (
        "No report to display. Add participants to view report"
      )}
    </div>
  );
}
